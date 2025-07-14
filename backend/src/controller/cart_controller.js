import Cart from "../models/cart_model.js";

const getUserByClerkId = async (clerkId) => {
  return await User.findOne({ clerkId });
};

export const getCartItems = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await getUserByClerkId(userId);
    const cart = await Cart.findOne({ user: user._id }).populate("items.book"); // Find the cart for the user and populate book details

    if (!user) {
      return res
        .status(404)
        .json({ message: "Error in getting cart items: User not found" });
    }

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Error in getting cart items: Cart not found" });
    }

    res.status(200).json(cart.items); // Return the items in the cart
  } catch (error) {
    console.error("Error in getting cart items:", error);
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await getUserByClerkId(userId);
    const { bookId, quantity } = req.body;

    if (!user) {
      return res
        .status(404)
        .json({ message: "Error in adding item to cart: User not found" });
    }

    if (!bookId || !quantity) {
      return res.status(400).json({
        message:
          "Error in adding item to cart: Book ID and quantity are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res
        .status(400)
        .json({ message: "Error in adding item to cart: Invalid book ID" });
    }

    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      return res
        .status(404)
        .json({ message: "Error in adding item to cart: Book not found" });
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity)) {
      return res.status(400).json({
        message: "Error in adding item to cart: Quantity must be a number",
      });
    }

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (existingItemIndex > -1) {
      const updatedQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (updatedQuantity <= 0) {
        cart.items.splice(existingItemIndex, 1);
      } else {
        cart.items[existingItemIndex].quantity = updatedQuantity;
      }
    } else {
      if (quantity > 0) {
        cart.items.push({ book: bookId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error("Error in adding item to cart:", error);
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await getUserByClerkId(userId);
    const itemId = req.params.id;

    if (!user) {
      return res
        .status(404)
        .json({ message: "Error in removing item from cart: User not found" });
    }

    if (!itemId) {
      return res.status(400).json({
        message: "Error in removing item from cart: Item ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res
        .status(400)
        .json({ message: "Error in removing item from cart: Invalid item ID" });
    }

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Error in removing item from cart: Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Error in removing item from cart: Item not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1); // Remove the item from the cart
    await cart.save();

    res
      .status(200)
      .json({ message: "Item removed from cart successfully", cart });
  } catch (error) {
    console.error("Error in removing item from cart:", error);
    next(error);
  }
};

export const removeAllCartItem = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await getUserByClerkId(userId);

    if (!user) {
      return res.status(404).json({
        message: "Error in removing all items from cart: User not found",
      });
    }

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Error in removing all items from cart: Cart not found",
      });
    }

    cart.items = []; // Clear all items from the cart
    await cart.save();

    res.status(200).json({ message: "All items removed from cart", cart });
  } catch (error) {
    console.error("Error in removing all items from cart:", error);
    next(error);
  }
};
