const db = require("../../database/models");

const getCategoriesWithProducts = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      include: [
        {
          association: "products",
          attributes: ["id", "title", "price", "discount"],
        },
      ],
    });

    return res.status(200).json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
    });
  }
};

const totalProductInDB = async (req, res) => {
  try {
  const total = await db.Product.count();

  return res.status(200).json({
      ok: true,
      data: total,
  });
  } catch (error) {
  return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
  });
  }
}

const getAllCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      attributes: ["title", "id"],
    });

    return res.status(200).json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
    });
  }
};

const getAllSections = async (req, res) => {
  try {
    const sections = await db.Section.findAll({
      attributes: ["title", "id"],
    });

    return res.status(200).json({
      ok: true,
      data: sections,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
    });
  }
};

const getAllRegions = async (req, res) => {
  try {
    const regions = await db.Region.findAll({
      attributes: ["title", "id"],
    });

    return res.status(200).json({
      ok: true,
      data: regions,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await db.Product.findAll({
      include: ["section", "category", "region", "images"],
    });

    return res.status(200).json({
      ok: true,
      data : products.map(product => {
        return {
            ...product.dataValues,
           image : `${req.protocol}://${req.get('host')}/images/productos/${product.images[0].file}`,
        }
    }),
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
    });
  }
};

const onCreateProduct = async (req, res) => {
  try {
    const { title, categoryId, sectionId,regionId, price, discount, amount, amountmin, description } = req.body;

    const newProduct = await db.Product.create({
      title: title ?.trim(),
      categoryId,
      sectionId,
      regionId,
      discount: discount || 0,
      price,
      amount,
      amountmin,
      description: description ?.trim(),
    });

    await db.Image.create({
      file : req.files[0]?.filename,
      main : true,
      productId : newProduct.id
    })

    let product = await db.Product.findByPk(newProduct.id,{
      include: ["section", "category", "region", "images"],
    })

    product = {
      ...product.dataValues,
      image: `${req.protocol}://${req.get('host')}/images/productos/${product.images[0].file}`
    }  

    return res.status(200).json({
      ok: true,
      data: product,
      msg: "Producto agregado con éxito",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
      data: null,
    });
  }
};

const onUpdateProduct = async (req, res) => {
  try {
    const {  title, categoryId, sectionId,regionId, price, discount, amount, amountmin, description } =
      req.body;

    await db.Product.update(
      {
      title: title?.trim(),
      categoryId,
      sectionId,
      regionId,
      discount: discount || 0,
      price,
      amount,
      amountmin,
      description: description?.trim(),
      },
      {
        where : {
          id : req.params.id
        }
      }
    );

    await db.Image.update({
      file : req.files[0]?.filename,
    },{
      where : {
        productId : req.params.id,
        main : true
      }
    })

    let product = await db.Product.findByPk(req.params.id,{
      include: ["section", "category", "region", "images"],
    })

    product = {
      ...product.dataValues,
      image: `${req.protocol}://${req.get('host')}/images/productos/${product.images[0].file}`
    }  

    return res.status(200).json({
      ok: true,
      data: product,
      msg: "Producto actualizado con éxito",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
      data: null,
    });
  }
};


const onDeleteProduct = async (req,res) => {
  try {
    await db.Product.destroy({
      where : {
        id : req.params.id
      }
    })
    return res.status(200).json({
      ok: true,
      data: null,
      msg: "Producto eliminado con éxito",
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message || "Upss, hubo un error",
      data: null,
    });
  }
}

module.exports = {
  getCategoriesWithProducts,
  getAllCategories,
  totalProductInDB,
  getAllSections,
  getAllRegions,
  getAllProducts,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
  
};
