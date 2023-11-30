import '../css/footer.css'

export default function Footer() {
    return (
        <>
            <footer>
                <div className="footerUpper">
                    <div className="socials">
                        <span>Socials:</span> <span><a href="https://github.com/bhuvanexh" className="github"></a></span> <span><a
                            href="https://www.linkedin.com/in/bhuvanesh-choudhary-2180a6265/" className="linkedin"></a></span>
                    </div>
                    <div className="email">
                        Contact Me: &nbsp; <span>bhuvaneshcho7@gmail.com</span>
                    </div>
                </div>
                <div className="footerBottom">
                    Project made by &nbsp;<a href="https://github.com/bhuvanexh">Bhuvanesh Choudhary</a>
                </div>
            </footer>
        </>
    )
}