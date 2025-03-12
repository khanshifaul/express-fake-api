import streamifier from "streamifier"; // Import streamifier
import cloudinary from "../config/cloudinary.js";
import Brand from "../models/Brand.js";

export const createBrand = async (req, res) => {
  const { name, description, status } = req.body;
  const logoFile = req.files?.logo ? req.files.logo[0] : null; // Get logo file

  try {
    // Check if brand name already exists
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ success: false, message: "Brand name already exists" });
    }

    let logoUrl = null;

    // Upload to Cloudinary if a logo file is provided
    if (logoFile) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "brand_logos" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(logoFile.buffer).pipe(stream);
        });

        logoUrl = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({ success: false, message: "Error uploading logo" });
      }
    }

    // Create and save the brand
    const brand = new Brand({
      name,
      description: description || "",
      status: status || "Active",
      logo: logoUrl,
    });

    await brand.save();

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({
      success: false,
      message: "Error creating brand",
      error: error.message,
    });
  }
};


export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({
      message: "Brands fetched successfully",
      brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res
      .status(500)
      .json({ message: "Error fetching brands", error: error.message });
  }
};

export const getBrandById = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json({
      message: "Brand fetched successfully",
      brand,
    });
  } catch (error) {
    console.error("Error fetching brand:", error);
    res
      .status(500)
      .json({ message: "Error fetching brand", error: error.message });
  }
};

export const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  const logoFile = req.files?.logo ? req.files.logo[0] : null;

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    // Check if name is unique
    if (name && name !== brand.name) {
      const nameExists = await Brand.findOne({ name });
      if (nameExists) {
        return res.status(400).json({ success: false, message: "Brand name already exists" });
      }
      brand.name = name;
    }

    // Update other fields
    if (description !== undefined) brand.description = description;
    if (status !== undefined) brand.status = status;

    // Handle logo upload & deletion
    if (logoFile) {
      try {
        // Delete old logo
        if (brand.logo) {
          const publicId = brand.logo.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`brand_logos/${publicId}`);
        }

        // Upload new logo using stream
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "brand_logos" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(logoFile.buffer).pipe(stream);
        });

        brand.logo = result.secure_url;
      } catch (cloudinaryError) {
        return res.status(500).json({ success: false, message: "Error updating logo" });
      }
    }

    await brand.save();
    res.status(200).json({ success: true, message: "Brand updated successfully", brand });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating brand",
      error: error.message,
    });
  }
};

export const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Optional: Delete the logo from Cloudinary
    if (brand.logo) {
      const publicId = brand.logo.split("/").pop().split(".")[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(`brand_logos/${publicId}`);
    }

    res.status(200).json({
      message: "Brand deleted successfully",
      brand,
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res
      .status(500)
      .json({ message: "Error deleting brand", error: error.message });
  }
};
