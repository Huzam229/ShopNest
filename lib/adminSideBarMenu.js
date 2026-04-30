// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_CATEGORY, ADMIN_CATEGORY_ADD, ADMIN_DASHBOARD, ADMIN_MEDIA, ADMIN_PRODUCT, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_VARIANT, ADMIN_PRODUCT_VARIANT_ADD } from "@/routes/AdminPanelRoutes";



export const adminAppSidebarMenu = [
    {
        title: "Dashboard",
        url: ADMIN_DASHBOARD,
        icon: AiOutlineDashboard
    },
    {
        title: "Category",
        url: "#",
        icon: BiCategory,
        submenu: [
            {
                title: 'Add Category',
                url: ADMIN_CATEGORY_ADD
            },
            {
                title: 'All Category',
                url: ADMIN_CATEGORY,

            },

        ]
    },
    {
        title: "Product",
        url: "#",
        icon: IoShirtOutline,
        submenu: [
            {
                title: 'Add Product',
                url: ADMIN_PRODUCT_ADD
            },
            {
                title: 'Add Varient',
                url: ADMIN_PRODUCT_VARIANT_ADD,

            },
            {
                title: 'All Products',
                url: ADMIN_PRODUCT,

            },
            {
                title: 'All Varient',
                url: ADMIN_PRODUCT_VARIANT,
            },

        ]
    },
    {
        title: "Coupons",
        url: "#",
        icon: RiCoupon2Line,
        submenu: [
            {
                title: 'Add Coupons',
                url: "#"
            },
            {
                title: 'All Coupons',
                url: "#",

            }
        ]
    },
    {
        title: "Orders",
        url: "#",
        icon: MdOutlineShoppingBag,
    },
    {
        title: "Customers",
        url: "#",
        icon: LuUserRound,
    },
    {
        title: "Rating & Review",
        url: "#",
        icon: IoMdStarOutline,
    },
    {
        title: "Media",
        url: ADMIN_MEDIA,
        icon: MdOutlinePermMedia,
    },
]