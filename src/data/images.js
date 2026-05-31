export const IMAGES = {
  hero: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/848d2920f_generated_a1a56d45.png",
  brandStory: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/7eb09b726_generated_1175b41b.png",
  menCollection: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/7bb949a88_generated_658f7aa7.png",
  womenCollection: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/6c9f121fe_generated_8cfca08e.png",
  accessoriesCollection: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/cd0ee5829_generated_e458a12c.png",
  founder: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/db55dc782_generated_5ff86f09.png",
  logo: "https://media.base44.com/images/public/user_69a93c23df926b837556fde6/764ab1c23_cropped-SMYT-WITH-TAGLINE-RED-TRANSPARENT-1-scaled-1-120x69.png",
  products: {
    1: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/135493fa6_generated_5477a415.png",
    2: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/9e935781a_generated_06703887.png",
    3: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/43df9edbb_generated_3b38942b.png",
    4: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/588c7b9fb_generated_86ef189a.png",
    5: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/8031f16e8_generated_eff0192e.png",
    6: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/57a42746d_generated_9a0630c9.png",
    7: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/249919e9b_generated_4ae6827f.png",
    8: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/5083d9bf5_generated_01f2d254.png",
    9: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/32876ab4c_generated_80e906ea.png",
    10: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/331c55168_generated_bf5cff75.png",
    11: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/1df2617d9_generated_705cb85a.png",
    12: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/c05201506_generated_66c27636.png",
    13: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/7f87b408e_generated_a969296e.png",
    14: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/89acfaa0c_generated_0090e97f.png",
    15: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/91326290a_generated_1cbd4196.png",
    16: "https://media.base44.com/images/public/6a14ace4102f73d9a7883838/b8c84c5af_generated_e47c518e.png",
  }
};

export const getProductImage = (productId) => {
  return IMAGES.products[productId] || IMAGES.hero;
};