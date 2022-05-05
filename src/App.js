import './App.css';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export const StyledListItem = styled(ListItem)(
    (props) => `
    & a:link {
      text-decoration: none;
    }
  `,
);

function App() {
    return (
        <Box p={2}>
            <List>
                <StyledListItem disablePadding>
                    <Link to="/chapter1">
                        <ListItemText primary="Chapter 1 (Simple Counter)" />
                    </Link>
                </StyledListItem>
                <StyledListItem disablePadding>
                    <Link to="/chapter2">
                        <ListItemText primary="Chapter 2 (Token Banker)" />
                    </Link>
                </StyledListItem>
                <StyledListItem disablePadding>
                    <Link to="/chapter3">
                        <ListItemText primary="Chapter 3 (Single Uniswap ERC20 to ERC20)" />
                    </Link>
                </StyledListItem>
                <StyledListItem disablePadding>
                    <Link to="/chapter4">
                        <ListItemText primary="Chapter 4 (Single Uniswap Eth to ERC20)" />
                    </Link>
                </StyledListItem>
                <StyledListItem disablePadding>
                    <Link to="/chapter5">
                        <ListItemText primary="Chapter 5 (Simple Remix IDE)" />
                    </Link>
                </StyledListItem>
                <StyledListItem disablePadding>
                    <Link to="/chapter6">
                        <ListItemText primary="Chapter 6 (Uniswap V2)" />
                    </Link>
                </StyledListItem>
            </List>
        </Box>
    );
}

export default App;
