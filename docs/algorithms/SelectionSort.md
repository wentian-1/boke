---
title: 选择排序法
date: 2023-04-04
sidebar: 'auto'
categories:
 - 算法
tags:
 - JavaScript
 - TypeScript
publish: true
---
## 选择排序
选择排序法是一种简单的排序算法，它的思想是从未排序的数组中选择最小的元素，然后将其放置在已排序数组的末尾。这个过程不断地重复，直到所有元素都被排序为止。
```ts
type TSelectionSortType = string | number

type TSelectionSort = (arr: TSelectionSortType[]) => void;

const selectionSort: TSelectionSort = function (arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        let min = arr[i];
        arr[i] = arr[j];
        arr[j] = min;
      }
    }
  }
};
let ssarr = [10, 8, 9, 2, 3, 7, 6, 5, 1, 4];
selectionSort(ssarr);
console.log(ssarr);

class SelectionSort {
  public static sort<T extends TSelectionSortType>(arr: T[]): void {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i; j < arr.length; j++) {
        if (arr[i] > arr[j]) {
          let min = arr[i];
          arr[i] = arr[j];
          arr[j] = min;
        }
      }
    }
  }
}

let ssstrArr = ['我', '你', '他', 'b', 'C', 'E', 'd']
SelectionSort.sort(ssstrArr);
console.log(ssstrArr)
```
选择排序法的时间复杂度为O(n^2)，并且它需要一个额外的数组来存储排序后的结果。尽管它不是最高效的排序算法，但选择排序法的实现比较简单，容易理解。
## 选择排序中的循环不变量
在选择排序算法中，循环不变量通常是指在每次循环迭代中，已经选择好的元素都是数组中最小的元素，并且这些元素已经按照升序排列。具体而言，循环不变量包括以下三点：
+ 初始化：当循环开始时，已经选择好的元素数量为0，数组中所有元素都是未排序的。`a[0, i-1]`是排序好的`a[i, n]`未排序的
+ 保持：在每次循环迭代中，需要找到未排序数组部分的最小元素，并将其放置在已排序数组的首位。这样，已排序数组就增加了一个元素，并且已经选择好的元素都是数组中最小的元素。
+ 终止：当循环结束时，数组中所有元素都已经按照升序排列。