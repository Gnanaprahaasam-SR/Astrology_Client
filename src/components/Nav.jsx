import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink, } from "react-router-dom";
import "../App.css";
import { logout } from "../redux/userInfo/userInfo";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const ApiUrl = import.meta.env.VITE_APP_SERVER;
import { MdOutlineLanguage } from "react-icons/md";
import logo from "../assets/Lakshimilogo.png"

const locales = {
  en: { title: ['English', 'Tamil'] },
  tn: { title: ['ஆங்கிலம்', "தமிழ்"] },
};
const localeKeys = ['en', 'tn'];

const Header = () => {
  const [action, setAction] = useState(false);
  const dispatch = useDispatch();
  const profileType = useSelector((state) => state.user?.user.profileType)
  // console.log(profileType);

  const { t, i18n } = useTranslation();
  const currentLang = locales[i18n.resolvedLanguage] ? i18n.resolvedLanguage : 'en';
  const labels = locales[currentLang].title;
  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };



  const Logout = async () => {

    const response = await axios.get(`${ApiUrl}/api/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });
    console.log(response);
    dispatch(logout());
  }


  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      expanded={action}
      className="header px-4  "
      onToggle={() => setAction(!action)}
    >
      <div className="container-fluid">
        <Navbar.Brand className="brand">
          <img src={logo} alt="logo" style={{ aspectRatio: "4/5", width: "55px", marginRight: "5px" }} />
          {t('nav.logoname')}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav menuItems 
        ">
          <Nav className=" d-flex m-auto p-2 ">
            <Nav.Link
              as={NavLink}
              to="/"
              onClick={() => setAction(false)}
              className={profileType === "Customer" && " d-none"}
            >
              {t('nav.dashboard')}
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin"
              onClick={() => setAction(false)}
              className={profileType === "Customer" && " d-none"}
            >
              {t("nav.admin")}
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/Services"
              onClick={() => setAction(false)}

            >
              {t('nav.services')}
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/MyBooking"
              onClick={() => setAction(false)}
              className={profileType === "Admin" && " d-none"}
            >
              {t('nav.mybooking')}
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/SlotControl"
              onClick={() => setAction(false)}
              className={profileType === "Customer" && " d-none"}
            >
              {t("nav.slotControl")}
            </Nav.Link>

          </Nav>
          <Nav className="d-flex flex-row align-items-center">
            <div className={profileType === "Customer" ? "language-btn" : "d-none"}>
              <MdOutlineLanguage size={20} color="#ffc44a" />
              <select
                value={i18n.resolvedLanguage}
                onChange={handleChange}
                className="dropdown"
              >
                {localeKeys.map((locale, idx) => (
                  <option
                    key={locale}
                    value={locale}
                    className={i18n.resolvedLanguage === locale ? "active" : "option"}
                  >
                    {labels[idx]}
                  </option>
                ))}
              </select>
            </div>
            <button className="login-btn " onClick={Logout}>{t("nav.logout")}</button>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
