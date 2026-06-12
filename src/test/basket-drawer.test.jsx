import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "./test-utils";
import BasketDrawer from "../features/landing/components/basket-drawer";
import { mockBasket } from "../utils/constants";
import { toast } from "react-toastify";

//*React-toastify fonksiyonunu mockla
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe("Basket Drawer Component", () => {
  const mockOnClose = vi.fn();

  // *Her testten önce mockOnClose fonksiyonu temizlensin
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Görünürülük, açma / kapatma", () => {
    it("isOpen false ise drawer gizli olmalı", () => {
      renderWithProviders(<BasketDrawer isOpen={false} onClose={null} />);

      const drawer = screen.getByRole("dialog");
      expect(drawer).toHaveClass("translate-x-full");
    });

    it("isOpen true ise drawer görünür olmalı", () => {
      renderWithProviders(<BasketDrawer isOpen={true} onClose={null} />);

      const drawer = screen.getByRole("dialog");
      expect(drawer).toHaveClass("translate-x-0");
      expect(drawer).not.toHaveClass("translate-x-full");
    });

    it("isOpen true ise drawer görünür olmalı", () => {
      renderWithProviders(<BasketDrawer isOpen={true} onClose={null} />);

      const drawer = screen.getByRole("dialog");
      expect(drawer).toHaveClass("translate-x-0");
      expect(drawer).not.toHaveClass("translate-x-full");
    });

    it("X butonuna tıklanınca drawer kapatılmalı", async () => {
      const user = userEvent.setup();
      renderWithProviders(<BasketDrawer isOpen={true} onClose={mockOnClose} />);

      const closeBtn = screen.getByRole("button", { name: /sepeti kapat/i });

      await user.click(closeBtn);

      //*mockOnClose fonksiyonu bir kere çağırıldı mı?
      expect(mockOnClose).toHaveBeenCalledOnce();
    });

    it("Backdrop'a tıklanınca drawer kapatılmalı", async () => {
      const user = userEvent.setup();
      renderWithProviders(<BasketDrawer isOpen={true} onClose={mockOnClose} />);

      const backdrop = screen.getByTestId("backdrop");

      await user.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledOnce();
    });
  });

  describe("Sepet içeriği", () => {
    it("sepet boşsa boş mesajı görünür olmalı", () => {
      renderWithProviders(<BasketDrawer isOpen={true} onClose={mockOnClose} />);

      screen.getByText("Sepetiniz boş");
    });

    it("sepet doluysa ürünlerin bilgileri listelenmelidir", () => {
      renderWithProviders(<BasketDrawer isOpen={true} onClose={null} />, {
        preloadedState: mockBasket,
      });
      //Sepetteki her ürünün isim/fotoğraf vb. bilgileri ekrana basılır.
      mockBasket.basket.items.forEach((item) => {
        screen.getByText(item.name);
        screen.getByText(item.quantity);
        screen.getByText(item.serving);
        screen.getByText(new RegExp(`${item.totalPrice}`, "i")); //regex ile yaptık
        const image = screen.getByAltText(item.name);
        expect(image).toHaveAttribute("src", item.imageUrl);
      });
    });

    it("toplam ürün sayısı ve toplam fiyat doğru görüntülenir", () => {
      renderWithProviders(<BasketDrawer isOpen={true} onClose={null} />, {
        preloadedState: mockBasket,
      });

      screen.getByText(`(${mockBasket.basket.totalQuantity} ürün)`);

      screen.getByText(`₺${mockBasket.basket.totalAmount.toFixed(2)}`);
    });
  });

  describe("Miktar artırma / azaltma / silme / onaylama", () => {
    it("+ butonuna tıklanınca miktar artırılır", async () => {
      const user = userEvent.setup();

      const { store } = renderWithProviders(
        <BasketDrawer isOpen={true} onClose={null} />,
        {
          preloadedState: mockBasket,
        },
      );

      const increaseBtn = screen.getByRole("button", {
        name: /1-külah miktarını artır/i,
      });

      expect(store.getState().basket.items[0].quantity).toBe(2);

      await user.dblClick(increaseBtn);

      expect(store.getState().basket.items[0].quantity).toBe(4);
    });

    it("- butonuna tıklanınca miktar azaltılır/kaldırılır", async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(
        <BasketDrawer isOpen={true} onClose={null} />,
        { preloadedState: mockBasket },
      );

      const decreaseBtn = screen.getByRole("button", {
        name: /1-külah miktarını azalt/i,
      });

      expect(store.getState().basket.items[0].quantity).toBe(2);
      expect(store.getState().basket.items).toHaveLength(2);

      await user.click(decreaseBtn);

      expect(store.getState().basket.items[0].quantity).toBe(1);

      await user.click(decreaseBtn);

      expect(store.getState().basket.items).toHaveLength(1);
    });

    it("sil butonuna tıklanınca ürün sepetten kaldırılır", async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(
        <BasketDrawer isOpen={true} onClose={null} />,
        { preloadedState: mockBasket },
      );

      const removeBtn1 = screen.getByRole("button", {
        name: "1-Külah ürününü sepetten çıkar",
      });
      const removeBtn2 = screen.getByRole("button", {
        name: "2-Bardakta ürününü sepetten çıkar",
      });

      expect(store.getState().basket.items).toHaveLength(2);

      await user.click(removeBtn1);

      expect(store.getState().basket.items).toHaveLength(1);

      await user.click(removeBtn2);

      expect(store.getState().basket.items).toHaveLength(0);

      expect(toast.info).toHaveBeenCalledWith("Ürün sepetten çıkarıldı");
    });

    it("siparişi onaylama butonuna tıklanınca sepet temizlenir", async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(
        <BasketDrawer isOpen={true} onClose={mockOnClose} />,
        { preloadedState: mockBasket },
      );

      const confirmBtn = screen.getByRole("button", {
        name: "Siparişi onayla",
      });

      await user.click(confirmBtn);

      const state = store.getState();
      expect(state.basket.items).toHaveLength(0);
      expect(state.basket.totalQuantity).toBe(0);
      expect(state.basket.totalAmount).toBe(0);

      expect(mockOnClose).toHaveBeenCalledOnce();

      //toast.success fonksiyonu çağrılmış mı?
      expect(toast.success).toHaveBeenCalledWith(
        "Siparişiniz alındı! Teşekkür ederiz 🎉",
      );
    });
  });
});
