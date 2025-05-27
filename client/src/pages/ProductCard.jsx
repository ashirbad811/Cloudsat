import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const products = [
  {
    title: "E-commerce Template",
    description: "A sleek online store layout",
    content: "Built with React & Tailwind. Perfect for online shops.",
    footer: "Starts at $29",
    image: "http://getwallpapers.com/wallpaper/full/e/8/8/628902.jpg",
  },
  {
    title: "Admin Dashboard",
    description: "Modern admin panel UI",
    content: "Features user stats, charts, and dark mode.",
    footer: "Starts at $39",
    image: "http://getwallpapers.com/wallpaper/full/e/8/8/628902.jpg",
  },
  {
    title: "Portfolio Theme",
    description: "Clean portfolio showcase",
    content: "Great for designers and developers.",
    footer: "Starts at $19",
    image: "http://getwallpapers.com/wallpaper/full/e/8/8/628902.jpg",
  },
  {
    title: "Code Snippet Manager",
    description: "Save and share code easily",
    content: "With syntax highlighting & search.",
    footer: "Starts at $15",
    image: "http://getwallpapers.com/wallpaper/full/e/8/8/628902.jpg",
  },
  {
    title: "SaaS Landing Page",
    description: "High-converting layout",
    content: "CTA focused with testimonials and pricing tables.",
    footer: "Starts at $25",
    image: "http://getwallpapers.com/wallpaper/full/e/8/8/628902.jpg",
  },
  {
    title: "Blog Starter Kit",
    description: "Minimal blog design",
    content: "Markdown support, SEO ready, responsive.",
    footer: "Starts at $20",
    image: "http://getwallpapers.com/wallpaper/full/e/8/8/628902.jpg",
  },
];

const ProductCard = () => {
  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition duration-300">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover rounded-t-md"
            />
            <CardHeader>
              <CardTitle>{product.title}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{product.content}</p>
            </CardContent>
            <CardFooter className="text-blue-600 font-semibold">
              {product.footer}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
