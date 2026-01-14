import Link from 'next/link';
import { Container, Menu, Icon } from 'semantic-ui-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar({ openDrawer }: { openDrawer: () => void; }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className='Navbar'>
      <Menu secondary style={{ width: '100vw' }}>
        <Container>
          <Menu.Item className='main-item'>
            <Link legacyBehavior href='/'>
              <a className='navbar-text'>Viet.io</a>
            </Link>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item
              className='hamburger-item'
              onClick={() => { openDrawer() }}>
              <Icon
                size='large'
                name='bars'
                className='hamburger' />
            </Menu.Item>
            <Menu.Item
              className='button-item theme-toggle'
              onClick={toggleTheme}
              style={{ cursor: 'pointer' }}>
              <Icon
                name={theme === 'dark' ? 'sun' : 'moon'}
                size='large'
                className='navbar-text2' />
            </Menu.Item>
            <Menu.Item
              as='a'
              className='button-item'
              href='https://github.com/renedeanda/Tech.Viet'
              target='_blank'
              rel="noopener">
              <div
                className='navbar-text2'>GitHub</div>
            </Menu.Item>
            <Menu.Item
              as='a'
              className='button-item'
              href='/companies'
              rel="noopener">
              <div
                className='navbar-text2'>Companies</div>
            </Menu.Item>
            <Menu.Item
              as='a'
              className='button-item'
              href='/investors'
              rel="noopener">
              <div
                className='navbar-text2'>Investors</div>
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </div>
  )
}