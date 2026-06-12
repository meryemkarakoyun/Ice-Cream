import { describe, it, expect, beforeEach } from "vitest";
import ProductCard from "../features/landing/components/product-card";
import { renderWithProviders, screen, userEvent } from "./test-utils";
import { mockProduct } from "../utils/constants";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe("Product Card Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ürün propu gönderilmediğinde null döner", () => {
    const { container } = renderWithProviders(<ProductCard product={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("card üzerindeki ürün adı / fiyatı gibi bilgiler doğru listelenir", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const imageWrapper = screen.getByTestId("product-image");
    expect(imageWrapper).toHaveClass(mockProduct.accent);

    const productImage = screen.getByAltText(mockProduct.name);
    expect(productImage).toHaveAttribute("src", mockProduct.imageUrl);

    screen.getByText(mockProduct.name);

    screen.getByText(`₺${mockProduct.price} / ${mockProduct.unit}`);
  });

  it("servis seçeneklerinden birine tıklanınca seçenek güncellenir", async () => {
    //*userEvent kurulum
    const user = userEvent.setup();

    renderWithProviders(<ProductCard product={mockProduct} />);

    const cornetBtn = screen.getByRole("button", { name: /külah/i }); //regex
    const cupBtn = screen.getByRole("button", { name: /bardakta/i }); //regex

    expect(cornetBtn).toHaveClass("bg-rose-600");

    expect(cupBtn).toHaveClass("bg-white");

    await user.click(cupBtn);

    expect(cornetBtn).toHaveClass("bg-white");

    expect(cupBtn).toHaveClass("bg-rose-600");

    await user.click(cornetBtn);

    expect(cornetBtn).toHaveClass("bg-rose-600");

    expect(cupBtn).toHaveClass("bg-white");
  });

  it("sepete ekle butonuna tıklanınca reducer'a haber gönderilir", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <ProductCard product={mockProduct} />,
    );

    const addToCartBtn = screen.getByRole("button", { name: /sepete ekle/i });

    //*Store da sepet dizisi boştur.
    expect(store.getState().basket.items).toHaveLength(0);
    expect(store.getState().basket.totalQuantity).toBe(0);

    await user.click(addToCartBtn);

    const basket = store.getState().basket;
    expect(basket.items).toHaveLength(1);
    expect(basket.totalQuantity).toBe(1);
    expect(basket.totalAmount).toBe(mockProduct.price);
    expect(basket.items[0]).toMatchObject({
      productId: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      serving: "Külah",
      quantity: 1,
    });
    //toast.success bildirimi çağırılmış mı?
    expect(toast.success).toHaveBeenCalledWith(
      `${mockProduct.name} sepete eklendi! (Külah)`,
    );
  });

  it("aynı ürün farklı servis seçenekleriyle sepete eklenebilir", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <ProductCard product={mockProduct} />,
    );

    const cupBtn = screen.getByRole("button", { name: /bardakta/i });
    const addToCartBtn = screen.getByRole("button", { name: /sepete ekle/i });

    await user.click(addToCartBtn);

    await user.click(cupBtn);

    await user.click(addToCartBtn);

    const basket = store.getState().basket;
    expect(basket.items).toHaveLength(2);
    expect(basket.totalQuantity).toBe(2);
    expect(basket.totalAmount).toBe(mockProduct.price * 2);
    expect(basket.items[0].serving).toBe("Külah");
    expect(basket.items[1].serving).toBe("Bardakta");
  });
});
