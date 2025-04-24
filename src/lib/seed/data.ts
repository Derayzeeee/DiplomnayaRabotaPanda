export const productsData = [
    {
      name: "Базовая футболка",
      description: "Классическая футболка из 100% хлопка премиального качества",
      price: 1990,
      oldPrice: 2490,
      images: [
        "https://i.imgur.com/1twoaDy.jpeg",
        "https://i.imgur.com/v7YpbEf.jpeg"
      ],
      category: "Футболки",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Белый", code: "#FFFFFF" },
        { name: "Черный", code: "#000000" },
        { name: "Серый", code: "#808080" }
      ],
      inStock: true,
      isNew: true,
      isSale: true
    },
    {
      name: "Джинсы классические",
      description: "Классические джинсы прямого кроя из плотного денима",
      price: 4990,
      oldPrice: 5990,
      images: [
        "https://i.imgur.com/3jvvzQf.jpeg",
        "https://i.imgur.com/QbKSkx8.jpeg"
      ],
      category: "Джинсы",
      sizes: ["30", "32", "34", "36"],
      colors: [
        { name: "Синий", code: "#0000FF" },
        { name: "Черный", code: "#000000" }
      ],
      inStock: true,
      isNew: false,
      isSale: true
    },
    {
      name: "Куртка зимняя",
      description: "Теплая зимняя куртка с капюшоном",
      price: 12990,
      images: [
        "https://i.imgur.com/QGD3finally.jpeg",
        "https://i.imgur.com/yG9d8F5.jpeg"
      ],
      category: "Верхняя одежда",
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Черный", code: "#000000" },
        { name: "Зеленый", code: "#008000" }
      ],
      inStock: true,
      isNew: true,
      isSale: false
    },
    {
      name: "Кроссовки спортивные",
      description: "Легкие спортивные кроссовки для бега",
      price: 7990,
      oldPrice: 8990,
      images: [
        "https://i.imgur.com/vN4uZ5m.jpeg",
        "https://i.imgur.com/8PmD0GN.jpeg"
      ],
      category: "Обувь",
      sizes: ["40", "41", "42", "43", "44"],
      colors: [
        { name: "Белый", code: "#FFFFFF" },
        { name: "Черный", code: "#000000" },
        { name: "Красный", code: "#FF0000" }
      ],
      inStock: true,
      isNew: false,
      isSale: true
    },
    {
      name: "Рубашка в клетку",
      description: "Повседневная рубашка из хлопка в клетку",
      price: 3990,
      images: [
        "https://i.imgur.com/jWGpN76.jpeg",
        "https://i.imgur.com/2XPMdRQ.jpeg"
      ],
      category: "Рубашки",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Синий", code: "#0000FF" },
        { name: "Красный", code: "#FF0000" }
      ],
      inStock: true,
      isNew: true,
      isSale: false
    }
  ];
  
  export const categoriesData = [
    {
      name: "Футболки",
      slug: "t-shirts",
      description: "Мужские и женские футболки",
      image: "https://i.imgur.com/category-tshirts.jpg"
    },
    {
      name: "Джинсы",
      slug: "jeans",
      description: "Джинсы различных фасонов",
      image: "https://i.imgur.com/category-jeans.jpg"
    },
    {
      name: "Верхняя одежда",
      slug: "outerwear",
      description: "Куртки, пальто и другая верхняя одежда",
      image: "https://i.imgur.com/category-outerwear.jpg"
    },
    {
      name: "Обувь",
      slug: "shoes",
      description: "Кроссовки, ботинки и другая обувь",
      image: "https://i.imgur.com/category-shoes.jpg"
    },
    {
      name: "Рубашки",
      slug: "shirts",
      description: "Мужские и женские рубашки",
      image: "https://i.imgur.com/category-shirts.jpg"
    }
  ];