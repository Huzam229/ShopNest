"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
    const { setTheme } = useTheme()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button type='button' variant="ghost"
                >
                    <IoSunnyOutline className="dark:hidden" />
                    <IoMoonOutline className="hidden dark:block" />
                </Button>
            </DropdownMenuTrigger >
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

export default ThemeSwitch