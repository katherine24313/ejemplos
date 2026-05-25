import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

const getDocumentNumber = (body) => {
  const rawDocument = body?.numero_documento ?? body?.documento ?? body?.document ?? body?.documento_persona;

  if (rawDocument === undefined || rawDocument === null || rawDocument === "") {
    throw new Error("numero_documento es obligatorio");
  }

  const number = Number(rawDocument);

  if (!Number.isFinite(number)) {
    throw new Error("numero_documento debe ser numérico");
  }

  return number;
};

const getOptionalString = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const stringValue = String(value).trim();
  return stringValue === "" ? undefined : stringValue;
};

const ensureModels = async () => {
  await Category.sync();
  await Product.sync();
};

const createCategory = async (body) => {
  const name = getOptionalString(body?.name);

  if (!name || name.length < 2) {
    throw new Error("name es obligatorio y debe tener al menos 2 caracteres");
  }

  return Category.create({
    name,
    description: getOptionalString(body?.description) ?? null,
    status: body?.status || "active"
  });
};

const createProduct = async (body) => {
  const name = getOptionalString(body?.name);

  if (!name || name.length < 2) {
    throw new Error("name es obligatorio y debe tener al menos 2 caracteres");
  }

  const price = Number(body?.price);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("price es obligatorio y debe ser un número mayor o igual a 0");
  }

  const stock = body?.stock === undefined || body?.stock === null ? 0 : Number(body.stock);

  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error("stock debe ser un número mayor o igual a 0");
  }

  let categoryId = body?.category_id;

  if (categoryId !== undefined && categoryId !== null && categoryId !== "") {
    categoryId = Number(categoryId);

    if (!Number.isFinite(categoryId) || categoryId <= 0) {
      throw new Error("category_id debe ser un número entero positivo");
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
      throw new Error(`Categoría con id ${categoryId} no encontrada`);
    }
  }

  const product = await Product.create({
    name,
    description: getOptionalString(body?.description) ?? null,
    price,
    stock,
    image_url: getOptionalString(body?.image_url) ?? null,
    category_id: categoryId ?? null,
    status: body?.status || "active"
  });

  return Product.findByPk(product.id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name", "status"] }]
  });
};

export const createByDocument = async (req, res) => {
  try {
    const documento = getDocumentNumber(req.body);

    await ensureModels();

    if (documento % 2 === 0) {
      const category = await createCategory(req.body);

      return res.status(201).json({
        ok: true,
        status: 201,
        tipo: "categoria",
        documento,
        data: category
      });
    }

    const product = await createProduct(req.body);

    return res.status(201).json({
      ok: true,
      status: 201,
      tipo: "producto",
      documento,
      data: product
    });
  } catch (error) {
    const message = error.message || "Error interno del servidor";

    if (message.includes("Validation") || message.includes(" obligatorio") || message.includes("numérico") || message.includes("encontrada") || message.includes("mayor o igual")) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message
      });
    }

    return res.status(500).json({
      ok: false,
      status: 500,
      message
    });
  }
};

export default createByDocument;