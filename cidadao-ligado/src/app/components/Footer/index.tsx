import styles from './Footer.module.css';

const Footer = ()=> {
    return (
        <footer className={styles.footer}>
            <p className={styles.footer__text}>
                &copy; {new Date().getFullYear()} Cidadão Ligado - Todos os direitos reservados.
            </p>
        </footer>
    )
}

export default Footer;