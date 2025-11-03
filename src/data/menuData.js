const images = import.meta.glob("../assets/images/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

export function getImage(name) {
  return images[`../assets/images/${name}`];
}

export const menuItems = [
  // TORTAS
  {
    id: 1,
    name: "Torta de jamón",
    price: 85,
    image: getImage("TortaJamon.png"),
    category: "Tortas",
  },
  {
    id: 2,
    name: "Torta de Atun",
    price: 90,
    image: getImage("TortaAtun.png"),
    category: "Tortas",
  },
  {
    id: 3,
    name: "Torta BBQ",
    price: 120,
    image: getImage("TortaBBQ.png"),
    category: "Tortas",
  },
  {
    id: 4,
    name: "Torta de Res",
    price: 75,
    image: getImage("TortaRes.png"),
    category: "Tortas",
  },
  {
    id: 5,
    name: "Torta Boneless",
    price: 95,
    image: getImage("TortaBoneless.png"),
    category: "Tortas",
  },
  {
    id: 6,
    name: "Torta de Pollo",
    price: 110,
    image: getImage("TortaPollo.png"),
    category: "Tortas",
  },

  // DESAYUNOS
  {
    id: 7,
    name: "Molletes",
    price: 80,
    image: getImage("DesyunoMolletes.png"),
    category: "Desayunos",
  },
  {
    id: 8,
    name: "Hot cakes",
    price: 60,
    image: getImage("DesayunoHotCakes.png"),
    category: "Desayunos",
  },
  {
    id: 9,
    name: "A la Mexicana",
    price: 70,
    image: getImage("DesayunoMex.png"),
    category: "Desayunos",
  },
  {
    id: 10,
    name: "Supreme",
    price: 85,
    image: getImage("DesayunoSupreme.png"),
    category: "Desayunos",
  },

  // BEBIDAS
  {
    id: 11,
    name: "Café",
    price: 40,
    image: getImage("cafe.png"),
    category: "Bebidas",
  },
  {
    id: 12,
    name: "Jugo de naranja",
    price: 35,
    image: getImage("jugo.png"),
    category: "Bebidas",
  },
  {
    id: 13,
    name: "Agua de horchata",
    price: 25,
    image: getImage("horchata.png"),
    category: "Bebidas",
  },
  {
    id: 14,
    name: "Agua de jamaica",
    price: 25,
    image: getImage("jamaica.png"),
    category: "Bebidas",
  },

  // POSTRES
  {
    id: 15,
    name: "Galleta casera",
    price: 20,
    image: getImage("galleta.png"),
    category: "Postres",
  },
  {
    id: 16,
    name: "Pan dulce",
    price: 18,
    image: getImage("pandulce.png"),
    category: "Postres",
  },
  {
    id: 17,
    name: "Cupcake",
    price: 30,
    image: getImage("cupcake.png"),
    category: "Postres",
  },
  {
    id: 18,
    name: "Brownie",
    price: 28,
    image: getImage("brownie.png"),
    category: "Postres",
  },
];
