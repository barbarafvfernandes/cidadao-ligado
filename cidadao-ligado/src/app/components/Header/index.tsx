import Link from "next/link"
import styles from "./Header.module.css";



const Header = ()=>{
    return(
        <header className={styles.header}>
            <div className={styles.header__logo}>
                <Link href="/">Cidadão Ligado</Link>
            </div>
        </header>
    )
}

export default Header;