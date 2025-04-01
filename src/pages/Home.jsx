import { Box, Typography, Paper, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Sorting Algorithms',
      description: 'Visualize and learn how different sorting algorithms work',
      path: '/sorting',
      image: 'https://via.placeholder.com/300x200?text=Sorting+Algorithms',
    },
    {
      title: 'Searching Algorithms',
      description: 'Explore various searching techniques and their efficiency',
      path: '/searching',
      image: 'https://via.placeholder.com/300x200?text=Searching+Algorithms',
    },
    {
      title: 'Graph Algorithms',
      description: 'Understand path-finding and graph traversal algorithms',
      path: '/graph',
      image: 'https://via.placeholder.com/300x200?text=Graph+Algorithms',
    },
    {
      title: 'Data Structures',
      description: 'Learn how different data structures operate and store information',
      path: '/data-structures',
      image: 'https://via.placeholder.com/300x200?text=Data+Structures',
    },
    {
      title: 'Greedy Algorithms',
      description: 'Visualize how greedy algorithms make locally optimal choices to solve problems',
      path: '/greedy',
      image: 'https://via.placeholder.com/300x200?text=Greedy+Algorithms',
    },
    {
      title: 'Double Pointer Algorithms',
      description: 'Explore algorithms that use two pointers to solve problems efficiently',
      path: '/double-pointer',
      image: 'https://via.placeholder.com/300x200?text=Double+Pointer+Algorithms',
    },
    {
      title: 'Divide & Conquer Algorithms',
      description: 'Visualize algorithms that break problems into smaller subproblems, solve them, and combine solutions',
      path: '/divide-conquer',
      image: 'https://via.placeholder.com/300x200?text=Divide+and+Conquer+Algorithms',
    },
    {
      title: 'Dynamic Programming Algorithms',
      description: 'Understand how dynamic programming solves complex problems by breaking them into simpler subproblems',
      path: '/dynamic-programming',
      image: 'https://via.placeholder.com/300x200?text=Dynamic+Programming+Algorithms',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, mt: 8, p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Algorithm Visualizer
        </Typography>
        <Typography variant="body1" paragraph>
          This interactive tool helps you understand algorithms and data structures through visual demonstrations.
          Select a category below to get started.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.title}>
            <Card sx={{ maxWidth: 345, height: '100%' }}>
              <CardActionArea onClick={() => navigate(category.path)} sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;