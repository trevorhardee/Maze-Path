# Maze-Path

## What is this?

This is a pathfinder project that includes a maze game.

## How did I set it up?

### Pathfinding

I started off by using two pathfinder algorithms, Dijikstra and A*. Dijikstra's algorithm looks at every node next to it and keeps track of the distance for each. Once it reaches the end, it draws the shortest path. The A* algorithm works similarly, but it knows which direction the end is. So it works towards the end in a more directed fashion.

### Walls

Once I was able to get the pathfinding piece taken care of with those two algorithms, I worked on getting walls in place. The walls are obstacles in place for the path.

### Maze

The last major piece was getting the maze introduced. I went with a recursive division algorithm to draw the mazes. The concept is that you draw a random row and column with a hole in each. Next you would repeat the last step in a smaller area. This practice would repeat itself until it reaches a small enough step.

### Game

Once everything was vizualising properly, I thought it would be fun for whoever looks at this to be able to play with the maze. So, I added functionality to draw your own path using 'w', 'a', 's', and 'd'. The A* method would start after around 10 seconds. It is extremely basic, but I can also build on this piece with confetti and some sort of timer.

## My thoughts on it

This was my first experience with React, so there was a major learning curve. I also had not done much with javascript prior to this. All in all, I'm glad that I was able to get a working version up. I'll likely come back and add some more algorithms and clean up the code as I get more proficient.
