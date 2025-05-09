import "./footer.scss"

export default function Footer() {
  return (
    <footer className="footer">
        <div className="footerLeft">
          <span className="footerLogo">Certary</span>
          <span className="copyright">Copyright © 2025</span>
        </div>
        <div className="footerLinks">
          <a href="/terms" className="footerLink">
            Terms & Conditions
          </a>
          <a href="/privacy" className="footerLink">
            Privacy Policy
          </a>
        </div>
    </footer>
  )
}
