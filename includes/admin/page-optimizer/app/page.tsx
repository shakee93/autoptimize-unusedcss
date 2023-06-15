"use client"
import Image from 'next/image'
import ThemeSwitcher from "@/components/theme-switcher";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:text-white text-black dark:bg-black bg-white">

      <h1>Hello RapidLoad optimizer is in and in forever!</h1>
        <ThemeSwitcher></ThemeSwitcher>

    </main>
  )
}
