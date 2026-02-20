// Sorting Algorithm Visualizer
document.addEventListener('DOMContentLoaded', () => {
  init();
});

const ALGORITHM_INFO = {
  bubble: {
    name: 'Bubble Sort',
    time: 'O(n²)',
    space: 'O(1)',
    stable: 'Yes',
    desc: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Simple but inefficient for large datasets.',
  },
  selection: {
    name: 'Selection Sort',
    time: 'O(n²)',
    space: 'O(1)',
    stable: 'No',
    desc: 'Finds the minimum element from the unsorted part and puts it at the beginning. Makes fewer swaps than bubble sort but same number of comparisons.',
  },
  insertion: {
    name: 'Insertion Sort',
    time: 'O(n²)',
    space: 'O(1)',
    stable: 'Yes',
    desc: 'Builds the sorted array one item at a time by inserting each element into its correct position. Efficient for small or nearly sorted datasets.',
  },
  merge: {
    name: 'Merge Sort',
    time: 'O(n log n)',
    space: 'O(n)',
    stable: 'Yes',
    desc: 'Divides the array into halves, recursively sorts them, and merges the sorted halves. Guaranteed O(n log n) but requires extra space.',
  },
  quick: {
    name: 'Quick Sort',
    time: 'O(n log n)',
    space: 'O(log n)',
    stable: 'No',
    desc: 'Picks a pivot element and partitions the array around it. Very fast in practice with good cache performance, though worst case is O(n²).',
  },
  heap: {
    name: 'Heap Sort',
    time: 'O(n log n)',
    space: 'O(1)',
    stable: 'No',
    desc: 'Builds a max-heap from the array, then repeatedly extracts the maximum element. In-place with guaranteed O(n log n) performance.',
  },
};

let state = {
  array: [],
  sorting: false,
  paused: false,
  cancelled: false,
  comparisons: 0,
  swaps: 0,
  startTime: 0,
  timerInterval: null,
  pauseResolver: null,
};

let elements = {};

function init() {
  elements = {
    visualizer: document.getElementById('visualizer'),
    algorithm: document.getElementById('algorithm'),
    arraySize: document.getElementById('arraySize'),
    speed: document.getElementById('speed'),
    sizeValue: document.getElementById('sizeValue'),
    speedValue: document.getElementById('speedValue'),
    generateBtn: document.getElementById('generateBtn'),
    sortBtn: document.getElementById('sortBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    comparisons: document.getElementById('comparisons'),
    swaps: document.getElementById('swaps'),
    elapsed: document.getElementById('elapsed'),
    status: document.getElementById('status'),
    algoName: document.getElementById('algoName'),
    algoTime: document.getElementById('algoTime'),
    algoSpace: document.getElementById('algoSpace'),
    algoStable: document.getElementById('algoStable'),
    algoDesc: document.getElementById('algoDesc'),
  };

  loadSettings();
  bindEvents();
  generateArray();
  updateAlgoInfo();
}

function loadSettings() {
  const saved = localStorage.getItem('sortvis-settings');
  if (!saved) return;
  try {
    const settings = JSON.parse(saved);
    if (settings.algorithm) elements.algorithm.value = settings.algorithm;
    if (settings.arraySize) elements.arraySize.value = settings.arraySize;
    if (settings.speed) elements.speed.value = settings.speed;
    elements.sizeValue.textContent = elements.arraySize.value;
    elements.speedValue.textContent = elements.speed.value;
  } catch {
    // ignore corrupt data
  }
}

function saveSettings() {
  localStorage.setItem('sortvis-settings', JSON.stringify({
    algorithm: elements.algorithm.value,
    arraySize: elements.arraySize.value,
    speed: elements.speed.value,
  }));
}

function bindEvents() {
  elements.generateBtn.addEventListener('click', () => {
    if (!state.sorting) generateArray();
  });

  elements.sortBtn.addEventListener('click', startSort);

  elements.pauseBtn.addEventListener('click', togglePause);

  elements.resetBtn.addEventListener('click', resetSort);

  elements.arraySize.addEventListener('input', () => {
    elements.sizeValue.textContent = elements.arraySize.value;
    saveSettings();
    if (!state.sorting) generateArray();
  });

  elements.speed.addEventListener('input', () => {
    elements.speedValue.textContent = elements.speed.value;
    saveSettings();
  });

  elements.algorithm.addEventListener('change', () => {
    updateAlgoInfo();
    saveSettings();
  });

  document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key.toLowerCase()) {
    case ' ':
      e.preventDefault();
      if (!state.sorting) startSort();
      break;
    case 'n':
      if (!state.sorting) generateArray();
      break;
    case 'p':
      if (state.sorting) togglePause();
      break;
    case 'r':
      if (state.sorting) resetSort();
      break;
  }
}

function generateArray() {
  const size = parseInt(elements.arraySize.value, 10);
  state.array = [];
  for (let i = 0; i < size; i++) {
    state.array.push(Math.floor(Math.random() * 95) + 5);
  }
  resetStats();
  renderBars();
}

function renderBars() {
  const container = elements.visualizer;
  container.innerHTML = '';
  const max = Math.max(...state.array);

  for (let i = 0; i < state.array.length; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(state.array[i] / max) * 100}%`;
    bar.dataset.index = i;
    container.appendChild(bar);
  }
}

function updateBar(index, value) {
  const bars = elements.visualizer.children;
  if (!bars[index]) return;
  const max = Math.max(...state.array);
  bars[index].style.height = `${(value / max) * 100}%`;
}

function setBarClass(index, className) {
  const bars = elements.visualizer.children;
  if (bars[index]) {
    bars[index].className = 'bar' + (className ? ' ' + className : '');
  }
}

function clearBarClasses() {
  const bars = elements.visualizer.children;
  for (let i = 0; i < bars.length; i++) {
    bars[i].className = 'bar';
  }
}

function resetStats() {
  state.comparisons = 0;
  state.swaps = 0;
  elements.comparisons.textContent = '0';
  elements.swaps.textContent = '0';
  elements.elapsed.textContent = '0.00s';
  elements.status.textContent = 'Ready';
  clearInterval(state.timerInterval);
}

function updateAlgoInfo() {
  const algo = elements.algorithm.value;
  const info = ALGORITHM_INFO[algo];
  elements.algoName.textContent = info.name;
  elements.algoTime.textContent = info.time;
  elements.algoSpace.textContent = info.space;
  elements.algoStable.textContent = info.stable;
  elements.algoDesc.textContent = info.desc;
}

function getDelay() {
  const speed = parseInt(elements.speed.value, 10);
  // Map 1-100 to ~500ms-1ms (exponential curve for smooth feel)
  return Math.max(1, Math.round(500 * Math.pow(0.95, speed)));
}

function delay() {
  return new Promise(resolve => {
    const ms = getDelay();
    const timeout = setTimeout(() => {
      if (state.paused) {
        state.pauseResolver = resolve;
      } else {
        resolve();
      }
    }, ms);
    // If cancelled during timeout, resolve immediately
    const checkCancel = setInterval(() => {
      if (state.cancelled) {
        clearTimeout(timeout);
        clearInterval(checkCancel);
        resolve();
      }
    }, 10);
    // Clean up interval when timeout fires
    setTimeout(() => clearInterval(checkCancel), ms + 50);
  });
}

async function checkPauseAndCancel() {
  if (state.cancelled) return false;
  if (state.paused) {
    await new Promise(resolve => {
      state.pauseResolver = resolve;
    });
  }
  return !state.cancelled;
}

function incrementComparisons() {
  state.comparisons++;
  elements.comparisons.textContent = state.comparisons.toLocaleString();
}

function incrementSwaps() {
  state.swaps++;
  elements.swaps.textContent = state.swaps.toLocaleString();
}

function setUIForSorting(sorting) {
  elements.generateBtn.disabled = sorting;
  elements.sortBtn.disabled = sorting;
  elements.arraySize.disabled = sorting;
  elements.algorithm.disabled = sorting;
  elements.pauseBtn.disabled = !sorting;
  elements.resetBtn.disabled = !sorting;
}

async function startSort() {
  if (state.sorting) return;

  state.sorting = true;
  state.paused = false;
  state.cancelled = false;
  state.comparisons = 0;
  state.swaps = 0;
  elements.comparisons.textContent = '0';
  elements.swaps.textContent = '0';
  elements.status.textContent = 'Sorting...';
  clearBarClasses();
  setUIForSorting(true);

  state.startTime = performance.now();
  state.timerInterval = setInterval(() => {
    const elapsed = (performance.now() - state.startTime) / 1000;
    elements.elapsed.textContent = elapsed.toFixed(2) + 's';
  }, 50);

  const algo = elements.algorithm.value;

  try {
    switch (algo) {
      case 'bubble': await bubbleSort(); break;
      case 'selection': await selectionSort(); break;
      case 'insertion': await insertionSort(); break;
      case 'merge': await mergeSort(); break;
      case 'quick': await quickSort(); break;
      case 'heap': await heapSort(); break;
    }
  } catch {
    // sort was cancelled
  }

  clearInterval(state.timerInterval);
  const elapsed = (performance.now() - state.startTime) / 1000;
  elements.elapsed.textContent = elapsed.toFixed(2) + 's';

  if (!state.cancelled) {
    await showSortedAnimation();
    elements.status.textContent = 'Completed';
  } else {
    elements.status.textContent = 'Cancelled';
  }

  state.sorting = false;
  state.paused = false;
  setUIForSorting(false);
}

function togglePause() {
  if (!state.sorting) return;

  state.paused = !state.paused;
  const btn = elements.pauseBtn;

  if (state.paused) {
    btn.innerHTML = '<span class="btn-icon">&#9654;</span> Resume';
    elements.status.textContent = 'Paused';
    clearInterval(state.timerInterval);
  } else {
    btn.innerHTML = '<span class="btn-icon">&#10074;&#10074;</span> Pause';
    elements.status.textContent = 'Sorting...';
    // Resume timer accounting for paused time
    state.timerInterval = setInterval(() => {
      const elapsed = (performance.now() - state.startTime) / 1000;
      elements.elapsed.textContent = elapsed.toFixed(2) + 's';
    }, 50);
    // Resume the sorting
    if (state.pauseResolver) {
      const resolver = state.pauseResolver;
      state.pauseResolver = null;
      resolver();
    }
  }
}

function resetSort() {
  state.cancelled = true;
  state.paused = false;
  if (state.pauseResolver) {
    const resolver = state.pauseResolver;
    state.pauseResolver = null;
    resolver();
  }
  clearInterval(state.timerInterval);
  // Let the sort loop finish, then regenerate
  setTimeout(() => {
    state.sorting = false;
    setUIForSorting(false);
    generateArray();
  }, 100);
}

async function showSortedAnimation() {
  const bars = elements.visualizer.children;
  for (let i = 0; i < bars.length; i++) {
    if (state.cancelled) return;
    bars[i].className = 'bar sorted sorted-animate';
    await new Promise(r => setTimeout(r, Math.max(5, 800 / bars.length)));
  }
}

// ==================== SORTING ALGORITHMS ====================

async function bubbleSort() {
  const arr = state.array;
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (state.cancelled) return;

      setBarClass(j, 'comparing');
      setBarClass(j + 1, 'comparing');
      incrementComparisons();
      await delay();

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        incrementSwaps();
        setBarClass(j, 'swapping');
        setBarClass(j + 1, 'swapping');
        updateBar(j, arr[j]);
        updateBar(j + 1, arr[j + 1]);
        await delay();
        swapped = true;
      }

      setBarClass(j, '');
      setBarClass(j + 1, '');
    }
    setBarClass(n - i - 1, 'sorted');
    if (!swapped) break;
  }
  setBarClass(0, 'sorted');
}

async function selectionSort() {
  const arr = state.array;
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    if (state.cancelled) return;
    let minIdx = i;
    setBarClass(i, 'comparing');

    for (let j = i + 1; j < n; j++) {
      if (state.cancelled) return;

      setBarClass(j, 'comparing');
      incrementComparisons();
      await delay();

      if (arr[j] < arr[minIdx]) {
        if (minIdx !== i) setBarClass(minIdx, '');
        minIdx = j;
        setBarClass(minIdx, 'pivot');
      } else {
        setBarClass(j, '');
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      incrementSwaps();
      setBarClass(i, 'swapping');
      setBarClass(minIdx, 'swapping');
      updateBar(i, arr[i]);
      updateBar(minIdx, arr[minIdx]);
      await delay();
      setBarClass(minIdx, '');
    }

    setBarClass(i, 'sorted');
  }
  setBarClass(arr.length - 1, 'sorted');
}

async function insertionSort() {
  const arr = state.array;
  const n = arr.length;
  setBarClass(0, 'sorted');

  for (let i = 1; i < n; i++) {
    if (state.cancelled) return;

    const key = arr[i];
    let j = i - 1;

    setBarClass(i, 'comparing');
    await delay();

    while (j >= 0 && arr[j] > key) {
      if (state.cancelled) return;

      incrementComparisons();
      arr[j + 1] = arr[j];
      incrementSwaps();
      setBarClass(j, 'swapping');
      updateBar(j + 1, arr[j + 1]);
      await delay();
      setBarClass(j, 'sorted');
      j--;
    }
    if (j >= 0) incrementComparisons();

    arr[j + 1] = key;
    updateBar(j + 1, key);
    setBarClass(j + 1, 'sorted');

    // Mark all sorted elements
    for (let k = 0; k <= i; k++) {
      setBarClass(k, 'sorted');
    }
  }
}

async function mergeSort() {
  const arr = state.array;
  await mergeSortHelper(arr, 0, arr.length - 1);
}

async function mergeSortHelper(arr, left, right) {
  if (left >= right || state.cancelled) return;

  const mid = Math.floor((left + right) / 2);
  await mergeSortHelper(arr, left, mid);
  await mergeSortHelper(arr, mid + 1, right);
  await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
  if (state.cancelled) return;

  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    if (state.cancelled) return;

    setBarClass(left + i, 'comparing');
    setBarClass(mid + 1 + j, 'comparing');
    incrementComparisons();
    await delay();

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      setBarClass(k, 'swapping');
      updateBar(k, arr[k]);
      i++;
    } else {
      arr[k] = rightArr[j];
      setBarClass(k, 'swapping');
      updateBar(k, arr[k]);
      incrementSwaps();
      j++;
    }

    await delay();
    setBarClass(k, '');
    k++;
  }

  while (i < leftArr.length) {
    if (state.cancelled) return;
    arr[k] = leftArr[i];
    updateBar(k, arr[k]);
    setBarClass(k, 'swapping');
    await delay();
    setBarClass(k, '');
    i++;
    k++;
  }

  while (j < rightArr.length) {
    if (state.cancelled) return;
    arr[k] = rightArr[j];
    updateBar(k, arr[k]);
    setBarClass(k, 'swapping');
    await delay();
    setBarClass(k, '');
    j++;
    k++;
  }
}

async function quickSort() {
  const arr = state.array;
  await quickSortHelper(arr, 0, arr.length - 1);
}

async function quickSortHelper(arr, low, high) {
  if (low >= high || state.cancelled) return;

  const pivotIndex = await partition(arr, low, high);
  if (state.cancelled) return;

  await quickSortHelper(arr, low, pivotIndex - 1);
  await quickSortHelper(arr, pivotIndex + 1, high);
}

async function partition(arr, low, high) {
  const pivot = arr[high];
  setBarClass(high, 'pivot');

  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (state.cancelled) return low;

    setBarClass(j, 'comparing');
    incrementComparisons();
    await delay();

    if (arr[j] < pivot) {
      i++;
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        incrementSwaps();
        setBarClass(i, 'swapping');
        setBarClass(j, 'swapping');
        updateBar(i, arr[i]);
        updateBar(j, arr[j]);
        await delay();
      }
      setBarClass(i, '');
    }
    setBarClass(j, '');
  }

  i++;
  if (i !== high) {
    [arr[i], arr[high]] = [arr[high], arr[i]];
    incrementSwaps();
    updateBar(i, arr[i]);
    updateBar(high, arr[high]);
  }

  setBarClass(high, '');
  setBarClass(i, 'sorted');

  return i;
}

async function heapSort() {
  const arr = state.array;
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (state.cancelled) return;
    await heapify(arr, n, i);
  }

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    if (state.cancelled) return;

    // Swap root with last unsorted
    [arr[0], arr[i]] = [arr[i], arr[0]];
    incrementSwaps();
    setBarClass(0, 'swapping');
    setBarClass(i, 'swapping');
    updateBar(0, arr[0]);
    updateBar(i, arr[i]);
    await delay();
    setBarClass(0, '');
    setBarClass(i, 'sorted');

    await heapify(arr, i, 0);
  }
  setBarClass(0, 'sorted');
}

async function heapify(arr, heapSize, rootIndex) {
  let largest = rootIndex;
  const left = 2 * rootIndex + 1;
  const right = 2 * rootIndex + 2;

  if (left < heapSize) {
    setBarClass(left, 'comparing');
    setBarClass(largest, 'comparing');
    incrementComparisons();
    await delay();
    if (arr[left] > arr[largest]) {
      setBarClass(largest, '');
      largest = left;
    } else {
      setBarClass(left, '');
    }
  }

  if (right < heapSize) {
    setBarClass(right, 'comparing');
    setBarClass(largest, 'comparing');
    incrementComparisons();
    await delay();
    if (arr[right] > arr[largest]) {
      setBarClass(largest, '');
      largest = right;
    } else {
      setBarClass(right, '');
    }
  }

  if (largest !== rootIndex) {
    [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
    incrementSwaps();
    setBarClass(rootIndex, 'swapping');
    setBarClass(largest, 'swapping');
    updateBar(rootIndex, arr[rootIndex]);
    updateBar(largest, arr[largest]);
    await delay();
    setBarClass(rootIndex, '');
    setBarClass(largest, '');

    await heapify(arr, heapSize, largest);
  } else {
    setBarClass(rootIndex, '');
  }
}
