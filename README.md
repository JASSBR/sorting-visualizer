# Sorting Algorithm Visualizer

An interactive web application that visualizes how different sorting algorithms work in real time. Watch bars rearrange themselves as algorithms compare and swap elements, with full speed control and live statistics.

## Features

- **6 Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and Heap Sort
- **Real-Time Visualization**: Color-coded bars show comparisons, swaps, pivots, and sorted elements
- **Speed Control**: Adjustable speed slider from slow step-through to near-instant sorting
- **Array Size Control**: Generate arrays from 5 to 200 elements
- **Live Statistics**: Track comparisons, swaps, and elapsed time during sorting
- **Pause & Resume**: Pause the visualization at any point and resume when ready
- **Algorithm Info Panel**: Displays time/space complexity and description for each algorithm
- **Keyboard Shortcuts**: Full keyboard support for quick control
- **Persistent Settings**: Algorithm, array size, and speed preferences saved to localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile screens
- **Dark Theme**: Modern dark UI with smooth transitions and hover effects

## Getting Started

```bash
# Clone the repo
git clone https://github.com/JASSBR/sorting-visualizer.git
cd sorting-visualizer

# Open in browser
open index.html
```

No build tools or dependencies required — just open `index.html` in any modern browser.

## Usage

1. **Select an algorithm** from the dropdown menu
2. **Adjust array size** with the slider to control the number of elements
3. **Set the speed** to control how fast the visualization runs
4. **Click "Sort"** or press `Space` to start the visualization
5. **Pause/Resume** during sorting with the Pause button or `P` key
6. **Reset** to stop sorting and generate a new array with the Reset button or `R` key
7. **Generate a new array** anytime with the New Array button or `N` key

## Keyboard Shortcuts

| Key | Action |
|-------|-------------------------|
| Space | Start sorting |
| N | Generate new array |
| P | Pause / Resume |
| R | Reset (stop & new array) |

## Color Legend

| Color | Meaning |
|--------|-----------|
| Purple | Unsorted element |
| Yellow | Being compared |
| Red | Being swapped |
| Violet | Pivot (Quick Sort) |
| Green | Sorted / in final position |

## Algorithms & Complexity

| Algorithm | Time (Avg) | Time (Worst) | Space | Stable |
|----------------|------------|--------------|---------|--------|
| Bubble Sort | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n²) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(1) | No |

## Project Structure

```
sorting-visualizer/
├── index.html       # Main HTML with full UI structure
├── src/
│   ├── app.js       # All sorting algorithms and visualization logic
│   └── style.css    # Dark theme styles, animations, responsive layout
├── assets/          # Screenshots and static assets
├── CLAUDE.md        # Project instructions
└── README.md        # This file
```

## Screenshots

_Add screenshots here_

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties, flexbox, grid, animations)
- Vanilla JavaScript (ES2020+, async/await)
- No external dependencies

## License

MIT

---

Built as part of my **Daily Project Challenge** - Day 2
