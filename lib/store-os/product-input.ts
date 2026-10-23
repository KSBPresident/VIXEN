export type StoreProductStatus = "draft" | "published" | "archived";
export type StoreProductInput = {
  name: string;
  category: string;
  description: string;
  price_minor_units: number;
  currency: "USD" | "TTD";
  stock_quantity: number;
  fulfillment_details: string;
  return_policy: string;
  status: StoreProductStatus;
};

type RawStoreProductInput = {
  name: string;
  category: string;
  description: string;
  price: string;
  currency: string;
  stockQuantity: string;
  fulfillmentDetails: string;
  returnPolicy: string;
  status: string;
};

type ValidationResult =
  | { ok: true; value: StoreProductInput }
  | { ok: false; error: string };

export function validateStoreProductInput(input: RawStoreProductInput): ValidationResult {
  const name = input.name.trim();
  const category = input.category.trim();
  const description = input.description.trim();
  const fulfillmentDetails = input.fulfillmentDetails.trim();
  const returnPolicy = input.returnPolicy.trim();

  if (name.length < 3 || name.length > 120) return { ok: false, error: "Product name must be 3–120 characters." };
  if (category.length < 2 || category.length > 80) return { ok: false, error: "Category must be 2–80 characters." };
  if (description.length < 10 || description.length > 4000) return { ok: false, error: "Description must be 10–4,000 characters." };
  if (fulfillmentDetails.length < 10 || fulfillmentDetails.length > 2000) return { ok: false, error: "Fulfillment details must be 10–2,000 characters." };
  if (returnPolicy.length < 10 || returnPolicy.length > 2000) return { ok: false, error: "Return details must be 10–2,000 characters." };
  if (input.currency !== "USD" && input.currency !== "TTD") return { ok: false, error: "Choose USD or TTD." };
  if (!/^(?:0|[1-9]\d{0,6})(?:\.\d{1,2})?$/.test(input.price)) return { ok: false, error: "Enter a price with up to two decimal places." };
  const priceMinorUnits = Math.round(Number(input.price) * 100);
  if (!Number.isSafeInteger(priceMinorUnits) || priceMinorUnits < 1) return { ok: false, error: "Price must be greater than zero." };
  if (!/^\d{1,6}$/.test(input.stockQuantity)) return { ok: false, error: "Stock must be a whole number from 0 to 999,999." };
  const stockQuantity = Number(input.stockQuantity);
  if (!Number.isSafeInteger(stockQuantity)) return { ok: false, error: "Enter a valid stock quantity." };
  if (!["draft", "published", "archived"].includes(input.status)) return { ok: false, error: "Choose draft, published, or archived." };
  if (input.status === "published" && stockQuantity === 0) return { ok: false, error: "A published listing must have stock available." };

  return {
    ok: true,
    value: {
      name, category, description,
      price_minor_units: priceMinorUnits,
      currency: input.currency,
      stock_quantity: stockQuantity,
      fulfillment_details: fulfillmentDetails,
      return_policy: returnPolicy,
      status: input.status as StoreProductStatus,
    },
  };
}
