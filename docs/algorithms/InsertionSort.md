---
title: 插入排序法
date: 2023-04-13
sidebar: 'auto'
categories:
 - 算法
tags:
 - JavaScript
 - TypeScript
publish: true
---
## 插入排序法
将一个元素插入到已经有序的子序列中，逐步扩大已排序的范围。排序开始时，第一个元素被认为已经排好序。接着，将第二个元素与第一个元素比较并插入到正确的位置。然后，按照同样的方式比较并插入第三个、第四个元素，以此类推，直到所有元素都被排序完成。
```ts
import deepClone from "../../deepClone";
type InsertSortValueType = number | string;
type InsertSortType = <T extends InsertSortValueType>(arg: T[]) => T[];

const arr = [7, 3, 5, 1, 9, 2];
const insertSort: InsertSortType = (source) => {
  const arr = deepClone(source);
  for (let i = 1; i < arr.length; i++) {
    let j = i - 1;
    let temp = arr[i];
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
  return arr;
};
console.log(insertSort(arr))

class InsertSortClass {
  public static insertSort<T extends InsertSortValueType>(source: T[]): T[] {
    const arr = deepClone(source);
    for (let i = 1; i < arr.length; i++) {
      let j = i - 1;
      let temp = arr[i];
      while (j >= 0 && arr[j] > temp) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = temp;
    }
    return arr;
  }
}
console.log(InsertSortClass.insertSort(arr))
```
+ 第一步，我们认为第一个元素7已经排好序。因此，从第二个元素3开始，我们将其与前一个元素7进行比较。由于3比7小，因此需要将3插入到7的前面，我们得到[3, 7, 5, 1, 9, 2]。
+ 第二步，我们将第三个元素5与前两个元素比较。由于5比7小，需要将其插入到7的前面，同时将3向前移动一个位置，得到[3, 5, 7, 1, 9, 2]。
+ 第三步，我们继续将第四个元素1与前面的元素比较。1比3、5、7都小，因此需要将1插入到最前面，得到[1, 3, 5, 7, 9, 2]。
+ 第四步，我们将第五个元素9与前面的元素比较。由于9比7大，不需要移动。然后，我们继续将第六个元素2与前面的元素比较。由于2比1、3、5、7、9都小，因此需要将其插入到最前面，得到[1, 2, 3, 5, 7, 9]。
+ 最后，我们得到了一个有序的数组[1, 2, 3, 5, 7, 9]。
## 插入排序法中的循环不变量
对于已排序的元素序列，其元素均小于等于当前待排序元素，而对于未排序的元素序列，其元素均大于当前待排序元素。每次迭代时，算法会将当前待排序元素插入到已排序的序列中的正确位置，并将当前待排序元素标记为已排序。这样，在每次迭代中，循环不变量得到保持。
## 时间复杂度
插入排序法的时间复杂度为O(n^2)，其中n是待排序数据的数量。最坏情况下，当输入数据已经按相反的顺序排列时，插入排序法的时间复杂度最高，为O(n^2)。但是，在最好的情况下，即输入数据已经按顺序排列时，插入排序法只需要O(n)的时间复杂度。此外，插入排序法的空间复杂度为O(1)，因为它只需要一个额外的变量来进行元素交换。
