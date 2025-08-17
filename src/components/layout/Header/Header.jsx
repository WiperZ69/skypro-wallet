import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../provider/AuthProvider";
import { LogOut } from "../../Modals/LogOut/LogOut";
import styles from "./Header.module.scss";

export const Header = () => {
  const { updateUserInfo } = useContext(AuthContext);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // --- mobile menu state ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // текущее название страницы для кнопки
  const currentTitle = location.pathname.startsWith("/spending")
    ? "Анализ расходов"
    : "Мои расходы";

  // закрытие по клику снаружи
  useEffect(() => {
    const onDocClick = (e) => {
      if (!isMenuOpen) return;
      const target = e.target;
      if (menuRef.current && menuRef.current.contains(target)) return;
      if (btnRef.current && btnRef.current.contains(target)) return;
      setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isMenuOpen]);

  // закрытие по ESC
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setIsMenuOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  // закрывать меню при смене маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const go = (path) => {
    if (location.pathname !== path) navigate(path);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link className={styles.header__logo} to="/">
          <img className={styles.header__image} src="/logo.svg" alt="logo" />
        </Link>

        {/* ДЕСКТОП — как было */}
        <div className={styles.header__links}>
          <Link to="/">Мои расходы</Link>
          <Link to="/spending">Анализ расходов</Link>
        </div>

        {/* МОБИЛЬНЫЙ переключатель (показывается только на 375px) */}
        <div className={styles.header__switch}>
          <button
            ref={btnRef}
            type="button"
            className={styles.switch__btn}
            aria-haspopup="listbox"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {currentTitle}
          </button>

          {isMenuOpen && (
            <div className={styles.switch__menu} ref={menuRef}>
              <button
                className={`${styles.switch__item} ${
                  location.pathname === "/" ? styles["is-active"] : ""
                }`}
                role="option"
                onClick={() => go("/")}
              >
                Мои расходы
              </button>

              {/* Заглушка для нового расхода */}
              <button
                className={styles.switch__item}
                role="option"
                onClick={() => alert("Заглушка: страница в разработке")}
              >
                Новый расход
              </button>

              <button
                className={`${styles.switch__item} ${
                  location.pathname.startsWith("/spending")
                    ? styles["is-active"]
                    : ""
                }`}
                role="option"
                onClick={() => go("/spending")}
              >
                Анализ расходов
              </button>
            </div>
          )}
        </div>
        <span className={styles.switch__caret} aria-hidden="true">
          ▾
        </span>

        <button
          className={styles.header__btn}
          onClick={() => setIsLogoutOpen(true)}
        >
          Выйти
        </button>
      </div>

      {isLogoutOpen && (
        <LogOut
          updateUserInfo={updateUserInfo}
          onClose={() => setIsLogoutOpen(false)}
        />
      )}
    </header>
  );
};
