import { NavLink } from "react-router-dom";
import styles from './MenuNavigation.module.css'
import allIcon from '../image/all.png'
import calenderIcon from '../image/calendar.png'

const MenuNavigation = () => {

  return (
    <header>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink to="/home" className={({isActive}) => isActive ? styles.active : undefined} end>
              <img src={allIcon} alt="all feeds" />
              <span>모아보기</span>
              </NavLink>
          </li>
          <li>
            <NavLink to="/feeds" className={({isActive}) => isActive ? styles.active : undefined}>
              <img src={calenderIcon} alt="year feeds" />
              <span>년도별</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MenuNavigation;
