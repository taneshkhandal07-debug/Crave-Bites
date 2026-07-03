import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const restaurantsData = [
  {
    name: "Bella Italia Bistro",
    slug: "bella-italia-bistro",
    address: "Connaught Place, New Delhi",
    rating: 4.6,
    cuisine: "Italian",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60",
    deliveryTime: 35,
    isPremium: true,
    menuItems: [
      {
        name: "Tomato Bruschetta",
        description: "Toasted garlic bread topped with marinated tomatoes, fresh basil, and extra virgin olive oil.",
        price: 180,
        category: "Starters",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh mozzarella, tomato sauce, and fresh basil leaves.",
        price: 340,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Fettuccine Alfredo",
        description: "Creamy fettuccine pasta tossed in parmesan and butter sauce with a hint of garlic.",
        price: 380,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Chicken Carbonara Pasta",
        description: "Spaghetti tossed in rich creamy egg yolk, parmesan cheese, black pepper, and chicken bacon.",
        price: 420,
        category: "Mains",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Classic Tiramisu",
        description: "Espresso-soaked ladyfingers layered with whipped mascarpone cream and dusted with cocoa powder.",
        price: 220,
        category: "Desserts",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "San Pellegrino",
        description: "Sparkling natural mineral water (500ml).",
        price: 120,
        category: "Beverages",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?w=500&auto=format&fit=crop&q=60",
      }
    ]
  },
  {
    name: "Tandoori Flames",
    slug: "tandoori-flames",
    address: "Koregaon Park, Pune",
    rating: 4.8,
    cuisine: "North Indian",
    coverImage: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=800&auto=format&fit=crop&q=60",
    deliveryTime: 40,
    isPremium: true,
    menuItems: [
      {
        name: "Paneer Tikka Angare",
        description: "Cottage cheese chunks marinated in spiced yogurt and grilled to perfection in clay oven.",
        price: 260,
        category: "Starters",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Tandoori Chicken (Half)",
        description: "Traditional spring chicken marinated in yogurt, ginger, garlic, and home-ground spices, roasted in tandoor.",
        price: 290,
        category: "Starters",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1610057099443-fde8c4d90ef8?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Butter Chicken",
        description: "Roasted tandoori chicken cooked in smooth, rich, and creamy tomato butter gravy.",
        price: 420,
        category: "Mains",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Dal Makhani",
        description: "Black lentils simmered overnight on slow fire with butter, cream, and tomatoes.",
        price: 310,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Butter Naan",
        description: "Flatbread cooked in tandoor and brushed generously with butter.",
        price: 60,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Gulab Jamun",
        description: "Soft cottage cheese dumplings fried and soaked in warm cardamom sugar syrup (2 pcs).",
        price: 90,
        category: "Desserts",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Masala Chaas",
        description: "Refreshing spiced buttermilk flavored with roasted cumin, coriander, and mint.",
        price: 70,
        category: "Beverages",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60",
      }
    ]
  },
  {
    name: "Golden Dragon Eatery",
    slug: "golden-dragon-eatery",
    address: "Indiranagar, Bengaluru",
    rating: 4.4,
    cuisine: "Chinese",
    coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=60",
    deliveryTime: 30,
    isPremium: false,
    menuItems: [
      {
        name: "Veg Spring Rolls",
        description: "Crispy fried wrapper loaded with stir fried garden fresh vegetables. Served with sweet chili sauce.",
        price: 190,
        category: "Starters",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Chicken Hakka Noodles",
        description: "Stir-fried noodles with chicken strips, crunchy vegetables, and Chinese sauces.",
        price: 290,
        category: "Mains",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Schezwan Paneer Gravy",
        description: "Paneer cubes tossed in fiery house-made Schezwan chili pepper gravy.",
        price: 320,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Darsaan with Ice Cream",
        description: "Crispy honey-coated flat noodles sprinkled with sesame seeds, served with vanilla ice cream.",
        price: 160,
        category: "Desserts",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1549590143-d5855148a9d5?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Iced Peach Tea",
        description: "Cold brewed tea flavored with sweet peach extract and fresh mint.",
        price: 110,
        category: "Beverages",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60",
      }
    ]
  },
  {
    name: "The Burger Junction",
    slug: "the-burger-junction",
    address: "Bandra West, Mumbai",
    rating: 4.5,
    cuisine: "Fast Food",
    coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60",
    deliveryTime: 25,
    isPremium: false,
    menuItems: [
      {
        name: "Cheesy Fries",
        description: "Golden crisp French fries smothered with melted Cheddar cheese sauce.",
        price: 150,
        category: "Starters",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Crunchy Veggie Burger",
        description: "Crispy vegetable patty, topped with fresh lettuce, onions, tomato, and spicy mayo inside toasted sesame buns.",
        price: 180,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Double Cheese Chicken Burger",
        description: "Two grilled minced chicken patties layered with two cheese slices, pickles, and special house sauce.",
        price: 270,
        category: "Mains",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Warm Choco Lava Cake",
        description: "Decadent chocolate cake with a molten liquid chocolate center.",
        price: 130,
        category: "Desserts",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Oreo Milkshake",
        description: "Creamy vanilla milkshake blended with Oreo cookies, topped with whipped cream.",
        price: 160,
        category: "Beverages",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60",
      }
    ]
  },
  {
    name: "Green Garden Salads",
    slug: "green-garden-salads",
    address: "Jubilee Hills, Hyderabad",
    rating: 4.7,
    cuisine: "Healthy",
    coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60",
    deliveryTime: 20,
    isPremium: true,
    menuItems: [
      {
        name: "Quinoa Avocado Salad",
        description: "Fluffy quinoa, cubed avocado, cherry tomatoes, cucumbers, tossed in citrus lemon vinaigrette.",
        price: 280,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Grilled Herb Chicken Breast",
        description: "Lean chicken breast grilled with rosemary and thyme, served with steamed broccoli and brown rice.",
        price: 360,
        category: "Mains",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Tofu Brown Rice Bowl",
        description: "Sauteed organic tofu cubes, edamame, shredded carrots, and dark soy dressing over warm brown rice.",
        price: 310,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Chia Seed Berry Pudding",
        description: "Chia seeds soaked in almond milk, layered with strawberry puree and fresh blueberries.",
        price: 180,
        category: "Desserts",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Green Detox Smoothie",
        description: "Freshly blended baby spinach, green apple, cucumber, celery, kiwi, and coconut water.",
        price: 150,
        category: "Beverages",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587caaec?w=500&auto=format&fit=crop&q=60",
      }
    ]
  },
  {
    name: "Sushi Sakura",
    slug: "sushi-sakura",
    address: "Salt Lake, Kolkata",
    rating: 4.6,
    cuisine: "Japanese",
    coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
    deliveryTime: 45,
    isPremium: true,
    menuItems: [
      {
        name: "Edamame Salted",
        description: "Steamed green soybeans in pod, sprinkled with sea salt flakes.",
        price: 180,
        category: "Starters",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "California Sushi Roll",
        description: "Crab sticks, creamy avocado, and crunchy cucumber, rolled inside out with sesame seeds (8 pcs).",
        price: 490,
        category: "Mains",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Crispy Avocado Roll",
        description: "Sliced avocado, cream cheese, and tempura flakes rolled with sushi rice (8 pcs).",
        price: 420,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Matcha Mochi Ice Cream",
        description: "Sweet glutinous rice dough balls filled with rich Japanese green tea ice cream (3 pcs).",
        price: 240,
        category: "Desserts",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Jasmine Green Tea",
        description: "Hot brewed refreshing traditional Japanese jasmine green tea.",
        price: 90,
        category: "Beverages",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
      }
    ]
  },
  {
    name: "Taco Fiesta",
    slug: "taco-fiesta",
    address: "SG Highway, Ahmedabad",
    rating: 4.3,
    cuisine: "Mexican",
    coverImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=60",
    deliveryTime: 30,
    isPremium: false,
    menuItems: [
      {
        name: "Nacho Supreme Grande",
        description: "Crispy tortilla chips loaded with hot refried beans, cheese sauce, salsa, and sour cream.",
        price: 220,
        category: "Starters",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Spicy Paneer Tacos",
        description: "Soft corn tortillas stuffed with grilled spicy paneer, cabbage slaw, onion cilantro, and chipotle mayo.",
        price: 240,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Chipotle Chicken Burrito",
        description: "Large flour tortilla rolled with chicken breast, Mexican rice, black beans, salsa, and guacamole.",
        price: 310,
        category: "Mains",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793fde?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Churros with Chocolate Sauce",
        description: "Fried dough pastries dusted in cinnamon sugar, served with warm milk chocolate dip (4 pcs).",
        price: 170,
        category: "Desserts",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Fresh Lime Mojito",
        description: "Cold bubbly sparkling water flavored with squeezed key lime, sugar syrup, and fresh crushed mint leaves.",
        price: 130,
        category: "Beverages",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
      }
    ]
  },
  {
    name: "Sher-e-Punjab Dhaba",
    slug: "sher-e-punjab-dhaba",
    address: "Sector 29, Gurugram",
    rating: 4.7,
    cuisine: "North Indian",
    coverImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=60",
    deliveryTime: 35,
    isPremium: false,
    menuItems: [
      {
        name: "Amritsari Machhi Tikka",
        description: "Carom-flavored crispy spiced fish tikka fried to golden brown, served with mint chutney.",
        price: 360,
        category: "Starters",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Kadhai Paneer Special",
        description: "Cottage cheese pieces cooked with diced bell peppers, fresh onion, and crushed coriander seeds in thick spicy masala.",
        price: 320,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Garlic Butter Laccha Paratha",
        description: "Crispy flaky layered wheat flatbread seasoned with minced garlic and butter.",
        price: 70,
        category: "Mains",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=60",
      },
      {
        name: "Lassi Malai Maar Ke",
        description: "Thick sweet yogurt beverage topped with a scoop of fresh heavy cream (clotted milk cream).",
        price: 110,
        category: "Beverages",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=60",
      }
    ]
  }
];

async function main() {
  console.log("Wiping existing database contents...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Seeding database records...");

  for (const restaurantInfo of restaurantsData) {
    const { menuItems, ...restaurantProps } = restaurantInfo;
    
    const createdRestaurant = await prisma.restaurant.create({
      data: restaurantProps
    });

    console.log(`Created Restaurant: ${createdRestaurant.name}`);

    for (const item of menuItems) {
      await prisma.menuItem.create({
        data: {
          ...item,
          restaurantId: createdRestaurant.id
        }
      });
    }
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding operation failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
