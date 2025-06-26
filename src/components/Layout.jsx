import React from 'react';
import { FiMenu } from 'react-icons/fi';

// Layout component renders the main navigation bar with a sidebar menu and dark mode toggle.
// Props:
// - onSelectEditor: callback function to handle editor selection from the sidebar.
// - sidebarOpen: boolean indicating if the sidebar is currently open.
// - toggleSidebar: function to open/close the sidebar.
// - darkMode: boolean indicating if dark mode is enabled.
// - toggleDarkMode: function to toggle between light and dark modes.
const Layout = ({ onSelectEditor, sidebarOpen, toggleSidebar, darkMode, toggleDarkMode }) => {
  // Handles selection of an editor option from the sidebar.
  // Calls the onSelectEditor callback with the selected editor.
  // Optionally, the sidebar can be closed on selection by uncommenting toggleSidebar().
  const handleSelect = (editor) => {
    onSelectEditor(editor);
  };

  // Styles for the fixed top navigation bar, adapting colors based on dark mode.
  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    height: '60px',
    padding: '0 20px',
    backgroundColor: darkMode ? '#000' : '#fff',
    color: darkMode ? '#fff' : '#000',
    fontSize: '1.5rem',
    zIndex: 1100,
  };

  // Styles for the sidebar menu, fixed on the left side, sliding in/out based on sidebarOpen.
  // Background and text colors adapt to dark mode.
  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: '200px',
    backgroundColor: darkMode ? '#000' : '#fff',
    borderRadius: '0 4px 4px 0',
    boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1200,
    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease',
  };

  // Collection of styles for various UI elements within the layout.
  const styles = {
    // Hamburger menu icon style shown inside the sidebar.
    hamburger: {
      cursor: 'pointer',
      fontSize: '1.5rem',
      marginRight: '10px',
      color: darkMode ? '#fff' : '#000',
    },
    // Hamburger
    hamburgerClosed: {
      position: 'fixed',
      top: '15px',
      left: '20px',
      cursor: 'pointer',
      fontSize: '1.5rem',
      zIndex: 1300,
      color: darkMode ? '#fff' : '#000',
    },
    // Header area of the sidebar containing the hamburger icon.
    sidebarHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid #444',
      color: darkMode ? '#fff' : '#000',
    },
    // Style for each selectable item in the sidebar menu.
    sidebarItem: {
      padding: '12px 20px',
      borderBottom: '1px solid #444',
      cursor: 'pointer',
      userSelect: 'none',
      color: darkMode ? '#fff' : '#000',
    },
    // Logo text style shown next to the hamburger icon when sidebar is closed.
    navbarLogo: {
      marginLeft: '30px',
      fontWeight: '900',
      fontSize: '1.5rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      userSelect: 'none',
      color: darkMode ? '#fff' : '#000',
    },
    // Container for the dark mode toggle switch and labels.
    modeToggleContainer: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 1200,
    },
    // Text style for the "Light" and "Dark" labels near the toggle.
    modeText: {
      fontSize: '1rem',
      userSelect: 'none',
      color: darkMode ? '#fff' : '#000',
    },
    // Style for the toggle switch background.
    toggleSwitch: {
      width: '50px',
      height: '26px',
      borderRadius: '15px',
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '2px',
      backgroundColor: darkMode ? '#4f4f4f' : '#ddd',
      boxShadow: darkMode
        ? 'inset 2px 2px 5px #2a2a2a, inset -2px -2px 5px #6b6b6b'
        : 'inset 2px 2px 5px #fff, inset -2px -2px 5px #c1c1c1',
      transition: 'background-color 0.3s ease',
    },
    // Style for the toggle circle that moves to indicate mode.
    toggleCircle: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      backgroundColor: '#f0f0f0',
      boxShadow: '2px 2px 5px #fff',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      transform: sidebarOpen ? 'translateX(24px)' : 'translateX(0)',
    },
    // Semi-transparent backdrop shown behind sidebar when open, clicking it closes sidebar.
    backdrop: {
      position: 'fixed',
      top: '60px',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 1000,
    },
  };

  return (
    <>
      {/* Navigation bar containing sidebar and dark mode toggle */}
      <nav style={navbarStyle}>
        {/* Sidebar menu with editor options */}
        <div style={sidebarStyle}>
          <div style={styles.sidebarHeader}>
            {/* Hamburger icon to toggle sidebar */}
            <div style={styles.hamburger} onClick={toggleSidebar}>
              <FiMenu />
            </div>
          </div>
          {/* Sidebar items for selecting different editors */}
          <div style={styles.sidebarItem} onClick={() => handleSelect('HTML/CSS')}>
            HTML/CSS
          </div>
          <div style={styles.sidebarItem} onClick={() => handleSelect('JavaScript')}>
            JavaScript
          </div>
          <div style={styles.sidebarItem} onClick={() => handleSelect('Python')}>
            Python
          </div>
          <div style={styles.sidebarItem} onClick={() => handleSelect('TypeScript')}>
            TypeScript
          </div>
        </div>
        {/* Hamburger icon and logo shown when sidebar is closed */}
        {!sidebarOpen && (
          <div style={styles.hamburgerClosed} onClick={toggleSidebar}>
            <FiMenu />
            <span style={styles.navbarLogo}>CodeEditor</span>
          </div>
        )}
        {/* Dark mode toggle switch with accessible keyboard support */}
        <div style={styles.modeToggleContainer}>
          <span style={styles.modeText}>Light</span>
          <div
            style={styles.toggleSwitch}
            onClick={toggleDarkMode}
            role="switch"
            aria-checked={darkMode}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleDarkMode();
            }}
          >
            <div
              style={{
                ...styles.toggleCircle,
                transform: darkMode ? 'translateX(24px)' : 'translateX(0)',
                boxShadow: darkMode ? '2px 2px 5px #1a1a1a' : '2px 2px 5px #fff',
              }}
            />
          </div>
          <span style={styles.modeText}>Dark</span>
        </div>
      </nav>
      {/* Backdrop overlay to close sidebar when clicking outside */}
      {sidebarOpen && <div style={styles.backdrop} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Layout;
