'use client'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoSunnyOutline } from "react-icons/io5"
import { IoMoonOutline } from "react-icons/io5"
import { useTheme } from "next-themes"

const ThemeSwitch = () => {

    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost">
                    <IoSunnyOutline className="dark:hidden " />
                    <IoMoonOutline className="hidden dark:block" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeSwitch