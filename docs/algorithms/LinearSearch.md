拿数组举例：就是给定一个目标值，和一个数组，然后从索引0开始逐一比较，找到返回目标索引，找不到返回-1
``` js
interface ISearch<T> {
  (arr: T[], target: T): number
}
const lineSearch: ISearch<number> = () =>{
  let position = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      position = i;
      return position;
    }
  }
  return position;
}

const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
const target = 8;

const result = lineSearch(arr, target);

console.log(result);


class LineSearch {
  static search<T> (arr: T[], target: T): number {
    let position = -1;
    for(let i = 0; i < arr.length; i++) {
      if (arr[i] === target) {
        position = i;
        return position
      }
    }
    return position;
  }
}

const result2 = LineSearch.search(['2', 1, '3'], '3')

console.log(result2)


```