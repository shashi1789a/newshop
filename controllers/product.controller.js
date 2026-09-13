const Product = require("../models/product.model.js");
const User = require("../models/User.js");
const mongoose = require("mongoose");

const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const {
  asyncHandler,
} = require("../utils/asyncHandler");

const {
  ApiResponse,
} = require("../utils/ApiResponse");

const {
  ApiError,
} = require("../utils/ApiError");

const ALLOWED_CATEGORIES = [
  "T_SHIRTS",
  "SHIRTS",
  "JEANS",
  "TROUSERS",
  "JACKETS",
  "HOODIES",
  "SWEATERS",
  "DRESSES",
  "SKIRTS",
  "SHORTS",
  "TOPS",
  "KURTAS",
  "SAREES",
  "TRACK_PANTS",
  "OTHER",
];

const ALLOWED_GENDERS = [
  "MEN",
  "WOMEN",
  "KIDS",
  "UNISEX",
];

const ALLOWED_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "FREE_SIZE",
];

const escapeRegex = (text) => {
  return text.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const parseArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeArray = (value) => {
  return parseArray(value).map((item) =>
    item.toUpperCase()
  );
};

const validateArrayValues = (
  values,
  allowedValues,
  fieldName
) => {

  const invalidValues = values.filter(
    (value) =>
      !allowedValues.includes(value)
  );

  if (invalidValues.length > 0) {
    throw new ApiError(
      400,
      `Invalid ${fieldName}: ${invalidValues.join(", ")}`
    );
  }
};

const createProduct = asyncHandler(
  async (req, res) => {


    if (
      !req.user ||
      !req.user._id
    ) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    if (
      req.user.role !== "seller" &&
      req.user.role !== "admin"
    ) {
      throw new ApiError(
        403,
        "Only sellers and admins can create products"
      );
    }

    const {
      title,
      name,
      description,
      category,
      brand,
      size,
      gender,
      color,
      material,
      fabricType,
      price,
      originalPrice,
      discount,
      stock,
    } = req.body;

    const productName =
      name?.trim() ||
      title?.trim();

    if (!productName) {
      throw new ApiError(
        400,
        "Product name is required"
      );
    }

    if (
      !description ||
      !description.trim()
    ) {
      throw new ApiError(
        400,
        "Product description is required"
      );
    }

    if (
      description.trim().length < 10
    ) {
      throw new ApiError(
        400,
        "Description must be at least 10 characters"
      );
    }

    if (
      !category ||
      !category.trim()
    ) {
      throw new ApiError(
        400,
        "Product category is required"
      );
    }

    const finalCategory =
      category.trim().toUpperCase();

    if (
      !ALLOWED_CATEGORIES.includes(
        finalCategory
      )
    ) {
      throw new ApiError(
        400,
        `Invalid product category: ${category}`
      );
    }

    if (
      !size ||
      !size.trim()
    ) {
      throw new ApiError(
        400,
        "Product size is required"
      );
    }

    const finalSize =
      size.trim().toUpperCase();

    if (
      !ALLOWED_SIZES.includes(
        finalSize
      )
    ) {
      throw new ApiError(
        400,
        `Invalid product size: ${size}`
      );
    }

    if (
      !gender ||
      !gender.trim()
    ) {
      throw new ApiError(
        400,
        "Product gender is required"
      );
    }

    const finalGender =
      gender.trim().toUpperCase();

    if (
      !ALLOWED_GENDERS.includes(
        finalGender
      )
    ) {
      throw new ApiError(
        400,
        `Invalid gender: ${gender}`
      );
    }

    const productFabric =
      fabricType?.trim() ||
      material?.trim() ||
      undefined;


    const productPrice =
      Number(price);

    if (
      Number.isNaN(productPrice) ||
      productPrice <= 0
    ) {
      throw new ApiError(
        400,
        "Price must be greater than 0"
      );
    }

    let productOriginalPrice;

    if (
      originalPrice !== undefined &&
      originalPrice !== null &&
      originalPrice !== ""
    ) {

      productOriginalPrice =
        Number(originalPrice);

      if (
        Number.isNaN(
          productOriginalPrice
        ) ||
        productOriginalPrice < 0
      ) {
        throw new ApiError(
          400,
          "Original price must be a valid number"
        );
      }

      if (
        productOriginalPrice <
        productPrice
      ) {
        throw new ApiError(
          400,
          "Original price cannot be less than selling price"
        );
      }
    }

    let productDiscount = 0;

    if (
      discount !== undefined &&
      discount !== null &&
      discount !== ""
    ) {

      productDiscount =
        Number(discount);

      if (
        Number.isNaN(
          productDiscount
        ) ||
        productDiscount < 0 ||
        productDiscount > 100
      ) {
        throw new ApiError(
          400,
          "Discount must be between 0 and 100"
        );
      }
    }

    if (
      productOriginalPrice &&
      productOriginalPrice > productPrice
    ) {

      const calculatedDiscount =
        (
          (
            productOriginalPrice -
            productPrice
          ) /
          productOriginalPrice
        ) * 100;

      productDiscount =
        Math.round(
          calculatedDiscount
        );
    }

    const productStock =
      Number(stock);

    if (
      Number.isNaN(productStock) ||
      productStock < 0 ||
      !Number.isInteger(
        productStock
      )
    ) {
      throw new ApiError(
        400,
        "Stock must be a valid whole number"
      );
    }

    if (
      !req.files ||
      !Array.isArray(req.files) ||
      req.files.length === 0
    ) {
      throw new ApiError(
        400,
        "At least one product image is required"
      );
    }


    if (
      req.files.length > 8
    ) {
      throw new ApiError(
        400,
        "Maximum 8 images are allowed"
      );
    }

    const uploadedImages = [];

    try {

      for (
        const file of req.files
      ) {

        const cloudinaryResponse =
          await uploadOnCloudinary(
            file.path
          );

        if (
          !cloudinaryResponse
        ) {
          throw new Error(
            "Cloudinary upload failed"
          );
        }

        uploadedImages.push({
          url:
            cloudinaryResponse.secure_url,

          publicId:
            cloudinaryResponse.public_id,
        });
      }

    } catch (error) {

      console.error(
        "Cloudinary upload error:",
        error
      );

      for (
        const image of uploadedImages
      ) {

        try {

          await deleteFromCloudinary(
            image.publicId
          );

        } catch (
          deleteError
        ) {

          console.error(
            "Cloudinary cleanup error:",
            deleteError.message
          );
        }
      }


      throw new ApiError(
        500,
        "Failed to upload product images"
      );
    }

    let product;

    try {

      product =
        await Product.create({

          name:
            productName,

          description:
            description.trim(),

          category:
            finalCategory,

          brand:
            brand
              ? brand.trim()
              : undefined,

          size:
            finalSize,

          gender:
            finalGender,

          fabricType:
            productFabric,

          color:
            color
              ? color.trim()
              : undefined,

          price:
            productPrice,

          originalPrice:
            productOriginalPrice,

          discount:
            productDiscount,

          stock:
            productStock,

          images:
            uploadedImages,

          seller:
            req.user._id,

          rating:
            0,

          reviews:
            [],

          isFeatured:
            false,

          isActive:
            true,
        });

    } catch (error) {

      console.error(
        "PRODUCT DATABASE ERROR:",
        error
      );

      for (
        const image of uploadedImages
      ) {

        try {

          await deleteFromCloudinary(
            image.publicId
          );

        } catch (
          deleteError
        ) {

          console.error(
            "Cloudinary cleanup failed:",
            deleteError.message
          );
        }
      }


      throw new ApiError(
        400,
        error.message ||
          "Failed to create product"
      );
    }

    try {

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: {
            uploadedProducts:
              product._id,
          },
        }
      );

    } catch (error) {

      console.error(
        "Failed to update seller products:",
        error
      );
    }

    return res.status(201).json(

      new ApiResponse(
        201,
        "Product created successfully",
        product
      )

    );
  }
);

const getAllProducts =
  asyncHandler(
    async (req, res) => {


      const {
        search,

        category,
        gender,
        size,
        brand,
        color,
        fabric,

        minPrice,
        maxPrice,

        minDiscount,
        maxDiscount,

        inStock,
        featured,

        page = 1,
        limit = 12,

        sort = "newest",
      } = req.query;

      const filter = {
        isActive: true,
      };

      const categories =
        normalizeArray(
          category
        );

      if (
        categories.length > 0
      ) {

        validateArrayValues(
          categories,
          ALLOWED_CATEGORIES,
          "category"
        );

        filter.category = {
          $in: categories,
        };
      }

      const genders =
        normalizeArray(
          gender
        );

      if (
        genders.length > 0
      ) {

        validateArrayValues(
          genders,
          ALLOWED_GENDERS,
          "gender"
        );

        filter.gender = {
          $in: genders,
        };
      }

      const sizes =
        normalizeArray(
          size
        );

      if (
        sizes.length > 0
      ) {

        validateArrayValues(
          sizes,
          ALLOWED_SIZES,
          "size"
        );

        filter.size = {
          $in: sizes,
        };
      }

      const brands =
        parseArray(brand);

      if (
        brands.length > 0
      ) {

        filter.brand = {
          $in: brands.map(
            (value) =>
              new RegExp(
                `^${escapeRegex(value)}$`,
                "i"
              )
          ),
        };
      }

      const colors =
        parseArray(color);

      if (
        colors.length > 0
      ) {

        filter.color = {
          $in: colors.map(
            (value) =>
              new RegExp(
                `^${escapeRegex(value)}$`,
                "i"
              )
          ),
        };
      }

      const fabrics =
        parseArray(fabric);

      if (
        fabrics.length > 0
      ) {

        filter.fabricType = {
          $in: fabrics.map(
            (value) =>
              new RegExp(
                `^${escapeRegex(value)}$`,
                "i"
              )
          ),
        };
      }

      if (
        search &&
        search.trim()
      ) {

        const searchText =
          search.trim();

        const searchWords =
          searchText
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 10);

        filter.$and =
          searchWords.map(
            (word) => {

              const regex =
                new RegExp(
                  escapeRegex(word),
                  "i"
                );

              return {
                $or: [

                  {
                    name: regex,
                  },

                  {
                    description: regex,
                  },

                  {
                    brand: regex,
                  },

                  {
                    category: regex,
                  },

                  {
                    gender: regex,
                  },

                  {
                    color: regex,
                  },

                  {
                    fabricType: regex,
                  },

                ],
              };
            }
          );
      }

      if (
        minPrice !== undefined ||
        maxPrice !== undefined
      ) {

        filter.price = {};


        if (
          minPrice !== undefined &&
          minPrice !== ""
        ) {

          const min =
            Number(minPrice);

          if (
            Number.isNaN(min) ||
            min < 0
          ) {
            throw new ApiError(
              400,
              "Invalid minimum price"
            );
          }

          filter.price.$gte =
            min;
        }


        if (
          maxPrice !== undefined &&
          maxPrice !== ""
        ) {

          const max =
            Number(maxPrice);

          if (
            Number.isNaN(max) ||
            max < 0
          ) {
            throw new ApiError(
              400,
              "Invalid maximum price"
            );
          }

          filter.price.$lte =
            max;
        }


        if (
          filter.price.$gte !== undefined &&
          filter.price.$lte !== undefined &&
          filter.price.$gte >
            filter.price.$lte
        ) {
          throw new ApiError(
            400,
            "Minimum price cannot be greater than maximum price"
          );
        }
      }

      if (
        minDiscount !== undefined ||
        maxDiscount !== undefined
      ) {

        filter.discount = {};


        if (
          minDiscount !== undefined &&
          minDiscount !== ""
        ) {

          const min =
            Number(minDiscount);

          if (
            Number.isNaN(min) ||
            min < 0 ||
            min > 100
          ) {
            throw new ApiError(
              400,
              "Invalid minimum discount"
            );
          }

          filter.discount.$gte =
            min;
        }


        if (
          maxDiscount !== undefined &&
          maxDiscount !== ""
        ) {

          const max =
            Number(maxDiscount);

          if (
            Number.isNaN(max) ||
            max < 0 ||
            max > 100
          ) {
            throw new ApiError(
              400,
              "Invalid maximum discount"
            );
          }

          filter.discount.$lte =
            max;
        }
      }

      if (
        inStock === "true"
      ) {

        filter.stock = {
          $gt: 0,
        };
      }

      if (
        featured === "true"
      ) {

        filter.isFeatured =
          true;
      }

      let currentPage =
        Number(page);

      let productsLimit =
        Number(limit);


      if (
        !Number.isInteger(
          currentPage
        ) ||
        currentPage < 1
      ) {
        currentPage = 1;
      }


      if (
        !Number.isInteger(
          productsLimit
        ) ||
        productsLimit < 1
      ) {
        productsLimit = 12;
      }

      if (
        productsLimit > 50
      ) {
        productsLimit = 50;
      }


      const skip =
        (
          currentPage - 1
        ) *
        productsLimit;

      let sortOption = {
        createdAt: -1,
      };


      switch (sort) {

        case "newest":

          sortOption = {
            createdAt: -1,
          };

          break;


        case "oldest":

          sortOption = {
            createdAt: 1,
          };

          break;


        case "price-low":

          sortOption = {
            price: 1,
          };

          break;


        case "price-high":

          sortOption = {
            price: -1,
          };

          break;


        case "rating":

          sortOption = {
            rating: -1,
            createdAt: -1,
          };

          break;


        case "discount":

          sortOption = {
            discount: -1,
            createdAt: -1,
          };

          break;


        case "name-asc":

          sortOption = {
            name: 1,
          };

          break;


        case "name-desc":

          sortOption = {
            name: -1,
          };

          break;


        default:

          throw new ApiError(
            400,
            `Invalid sort option: ${sort}`
          );
      }

      const [
        products,
        totalProducts,
      ] = await Promise.all([

        Product.find(filter)

          .populate(
            "seller",
            "name email profileImage role"
          )

          .sort(
            sortOption
          )

          .skip(
            skip
          )

          .limit(
            productsLimit
          )

          .lean(),


        Product.countDocuments(
          filter
        ),

      ]);

      const totalPages =
        Math.ceil(
          totalProducts /
          productsLimit
        );

      return res.status(200).json(

        new ApiResponse(
          200,
          "Products fetched successfully",
          {
            products,

            filters: {
              search:
                search || "",

              category:
                categories,

              gender:
                genders,

              size:
                sizes,

              brand:
                brands,

              color:
                colors,

              fabric:
                fabrics,

              minPrice:
                minPrice || null,

              maxPrice:
                maxPrice || null,

              minDiscount:
                minDiscount || null,

              maxDiscount:
                maxDiscount || null,

              inStock:
                inStock === "true",

              featured:
                featured === "true",

              sort,
            },

            pagination: {

              currentPage,

              totalPages,

              totalProducts,

              productsPerPage:
                productsLimit,

              hasNextPage:
                currentPage <
                totalPages,

              hasPreviousPage:
                currentPage > 1,
            },
          }
        )

      );
    }
  );

const getProductById =
  asyncHandler(
    async (req, res) => {

      const {
        id,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        throw new ApiError(
          400,
          "Invalid product ID"
        );
      }

      const product =
        await Product.findOne({

          _id:
            id,

          isActive:
            true,

        })
        .populate(
          "seller",
          "name email profileImage role"
        );

      if (!product) {

        throw new ApiError(
          404,
          "Product not found"
        );
      }

      return res.status(200).json(

        new ApiResponse(
          200,
          "Product fetched successfully",
          product
        )

      );
    }
  );

const updateProduct = asyncHandler(async (req, res) => {

  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Authentication required");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const isAdmin = req.user.role === "admin";
  const isOwner =
    product.seller &&
    product.seller.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "You are not authorized to update this product");
  }

  const {
    name,
    title,
    description,
    category,
    brand,
    size,
    gender,
    color,
    material,
    fabricType,
    price,
    originalPrice,
    discount,
    stock,
  } = req.body;

  if (name || title) {
    product.name = (name || title).trim();
  }

  if (description) {
    if (description.trim().length < 10) {
      throw new ApiError(400, "Description must be at least 10 characters");
    }
    product.description = description.trim();
  }

  if (category) {
    const finalCategory = category.trim().toUpperCase();
    if (!ALLOWED_CATEGORIES.includes(finalCategory)) {
      throw new ApiError(400, `Invalid product category: ${category}`);
    }
    product.category = finalCategory;
  }

  if (size) {
    const finalSize = size.trim().toUpperCase();
    if (!ALLOWED_SIZES.includes(finalSize)) {
      throw new ApiError(400, `Invalid product size: ${size}`);
    }
    product.size = finalSize;
  }

  if (gender) {
    const finalGender = gender.trim().toUpperCase();
    if (!ALLOWED_GENDERS.includes(finalGender)) {
      throw new ApiError(400, `Invalid gender: ${gender}`);
    }
    product.gender = finalGender;
  }

  if (brand) product.brand = brand.trim();
  if (color) product.color = color.trim();

  const newFabric = fabricType?.trim() || material?.trim();
  if (newFabric) product.fabricType = newFabric;

  if (price !== undefined && price !== "") {
    const productPrice = Number(price);
    if (Number.isNaN(productPrice) || productPrice <= 0) {
      throw new ApiError(400, "Price must be greater than 0");
    }
    product.price = productPrice;
  }

  if (originalPrice !== undefined && originalPrice !== "") {

    const productOriginalPrice = Number(originalPrice);

    if (
      Number.isNaN(productOriginalPrice) ||
      productOriginalPrice < product.price
    ) {
      throw new ApiError(
        400,
        "Original price cannot be less than selling price"
      );
    }

    product.originalPrice = productOriginalPrice;

    product.discount = Math.round(
      ((productOriginalPrice - product.price) / productOriginalPrice) * 100
    );

  } else if (discount !== undefined && discount !== "") {

    const productDiscount = Number(discount);

    if (
      Number.isNaN(productDiscount) ||
      productDiscount < 0 ||
      productDiscount > 100
    ) {
      throw new ApiError(400, "Discount must be between 0 and 100");
    }

    product.discount = productDiscount;
  }

  if (stock !== undefined && stock !== "") {
    const productStock = Number(stock);
    if (
      Number.isNaN(productStock) ||
      productStock < 0 ||
      !Number.isInteger(productStock)
    ) {
      throw new ApiError(400, "Stock must be a valid whole number");
    }
    product.stock = productStock;
  }

  if (req.files && req.files.length > 0) {

    if (req.files.length > 8) {
      throw new ApiError(400, "Maximum 8 images are allowed");
    }

    const uploadedImages = [];

    try {

      for (const file of req.files) {

        const cloudinaryResponse = await uploadOnCloudinary(file.path);

        if (!cloudinaryResponse) {
          throw new Error("Cloudinary upload failed");
        }

        uploadedImages.push({
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
        });
      }

    } catch (error) {

      for (const image of uploadedImages) {
        try {
          await deleteFromCloudinary(image.publicId);
        } catch (deleteError) {
          console.error("Cloudinary cleanup error:", deleteError.message);
        }
      }

      throw new ApiError(500, "Failed to upload product images");
    }

    // Purani images delete karo
    for (const oldImage of product.images) {
      if (oldImage.publicId) {
        try {
          await deleteFromCloudinary(oldImage.publicId);
        } catch (error) {
          console.error("Cloudinary delete failed:", error.message);
        }
      }
    }

    product.images = uploadedImages;
  }

  await product.save();

  return res.status(200).json(
    new ApiResponse(200, "Product updated successfully", product)
  );
});


const deleteProduct =
  asyncHandler(
    async (req, res) => {

      const {
        id,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        throw new ApiError(
          400,
          "Invalid product ID"
        );
      }

      if (
        !req.user ||
        !req.user._id
      ) {

        throw new ApiError(
          401,
          "Authentication required"
        );
      }

      const product =
        await Product.findById(
          id
        );


      if (!product) {

        throw new ApiError(
          404,
          "Product not found"
        );
      }

      const isAdmin =
        req.user.role ===
        "admin";

      const isSeller =
        req.user.role ===
        "seller";

      const isOwner =
        product.seller &&
        product.seller.toString() ===
          req.user._id.toString();


      if (
        !isAdmin &&
        !(isSeller && isOwner)
      ) {

        throw new ApiError(
          403,
          "You are not authorized to delete this product"
        );
      }

      if (
        product.images &&
        product.images.length > 0
      ) {

        for (
          const image
          of product.images
        ) {

          if (
            image.publicId
          ) {

            try {

              await deleteFromCloudinary(
                image.publicId
              );

            } catch (
              error
            ) {

              console.error(
                "Cloudinary delete failed:",
                error.message
              );
            }
          }
        }
      }

      await Product.findByIdAndDelete(
        id
      );

      try {

        await User.findByIdAndUpdate(
          product.seller,
          {
            $pull: {
              uploadedProducts:
                product._id,
            },
          }
        );

      } catch (
        error
      ) {

        console.error(
          "Failed to remove product from seller:",
          error
        );
      }

      return res.status(200).json(

        new ApiResponse(
          200,
          "Product deleted successfully",
          null
        )

      );
    }
  );


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};