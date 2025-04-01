import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DataArrayIcon from '@mui/icons-material/DataArray';
import HomeIcon from '@mui/icons-material/Home';
import GreedyIcon from '@mui/icons-material/AttachMoney';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MemoryIcon from '@mui/icons-material/Memory';

const drawerWidth = 240;

const Sidebar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Sorting Algorithms', icon: <SortIcon />, path: '/sorting' },
    { text: 'Searching Algorithms', icon: <SearchIcon />, path: '/searching' },
    { text: 'Graph Algorithms', icon: <AccountTreeIcon />, path: '/graph' },
    { text: 'Data Structures', icon: <DataArrayIcon />, path: '/data-structures' },
    { text: 'Greedy Algorithms', icon: <GreedyIcon />, path: '/greedy' },
    { text: 'Double Pointer Algorithms', icon: <CompareArrowsIcon />, path: '/double-pointer' },
    { text: 'Divide & Conquer Algorithms', icon: <CallSplitIcon />, path: '/divide-conquer' },
    { text: 'Dynamic Programming Algorithms', icon: <MemoryIcon />, path: '/dynamic-programming' },
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;