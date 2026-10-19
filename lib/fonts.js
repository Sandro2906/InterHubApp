import { Chakra_Petch } from "next/font/google";
import {Barlow } from "next/font/google";
import { Outfit } from "next/font/google";

export const chakra = Chakra_Petch({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic",],
});


export const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["800", "900"],
  style: ["italic"],
});

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});