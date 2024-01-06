import { binarySearch } from "src/utils/binary_search.ts";
import { Factory } from "src/utils/factory.ts";

export interface CustomSize {
  index: number;
  size: number;
}
export interface Index {
  index: number;
  start: number;
  end: number;
}
interface Region {
  startIndex: number;
  endIndex: number; // Exclusive
  start: number;
  end: number;
  size: number;
}
export class VirtualizedList {
  private _defaultIndexSize: number;
  private _customSizesMap: {
    [key: number]: CustomSize;
  } = {};
  private _length = 0;
  private _regions: Region[] = [];
  private _indexes: Index[] = [];
  private _size = 0;
  private _indexFactory = new Factory<Index>(() => {
    return {
      index: 0,
      start: 0,
      end: 0,
    };
  });

  constructor(defaultIndexSize: number, length: number) {
    if (defaultIndexSize === 0) {
      throw new Error('Default size cannot be 0.');
    }
    this._defaultIndexSize = defaultIndexSize;
    this._length = length;
    this._generateRegions();
  }

  getDefaultSize() {
    return this._defaultIndexSize;
  }

  setDefaultSize(size: number) {
    if (size === 0) {
      throw new Error('Default size cannot be 0.');
    }
    this._defaultIndexSize = size;
    this._generateRegions();
  }

  setCustomSize(index: number, size: number) {
    let customSize = this._customSizesMap[index];
    if (customSize != null) {
      if (size === this._defaultIndexSize) {
        delete this._customSizesMap[index];
      } else {
        customSize.size = size;
      }
    } else {
      if (size !== this._defaultIndexSize) {
        this._customSizesMap[index] = {
          index,
          size,
        };
      }
    }
    this._generateRegions();
  }

  getCustomSize(index: number) {
    return this._customSizesMap[index]?.size || null;
  }

  getIndexSize(index: number): number {
    let customSize = this._customSizesMap[index];
    return customSize != null ? customSize.size : this._defaultIndexSize;
  }

  getIndexesWithinRange(start: number, end: number) {
    this._indexes.length = 0;
    this._indexFactory.releaseAll();

    if (this._regions.length === 0) {
      return this._indexes;
    }

    const startRegionIndex = Math.max(
      binarySearch(this._regions, start, this._findRegionIn),
      0
    );

    const endRegionIndex = Math.max(
      binarySearch(this._regions, end, this._findRegionIn),
      startRegionIndex
    );

    for (let x = startRegionIndex; x <= endRegionIndex; x++) {
      const region = this._regions[x];
      const startIndex = Math.max(Math.floor((start - region.start) / region.size), 0);
      const endIndex = Math.min(
        Math.ceil((end - region.start) / region.size),
        region.endIndex - region.startIndex
      );
      for (let index = startIndex; index < endIndex; index++) {
        const start = index * region.size + region.start;
        const end = start + region.size;
        const result = this._indexFactory.useInstance();
        result.index = index + region.startIndex;
        result.start = start;
        result.end = end;
        if (index >= 0) {
          this._indexes.push(result);
        }
      }
    }
    return this._indexes;
  }

  setLength(length: number) {
    this._length = length;
    this._generateRegions();
  }

  clear() {
    this._length = 0;
    this._customSizesMap = {};
  }

  getLength() {
    return this._length;
  }

  getSize() {
    return this._size;
  }

  private _generateRegions() {
    let lastIndex = 0;
    let last = 0;
    this._regions.length = 0;
    const keys = Object.keys(this._customSizesMap);
    for (let x = 0; x < keys.length; x++) {
      const customSize = this._customSizesMap[Number(keys[x])];
      const startIndex = lastIndex;
      let index = customSize.index;
      if (index - startIndex > 0) {
        const end = (index - startIndex) * this._defaultIndexSize + last;
        const gap = {
          startIndex,
          endIndex: index,
          size: this._defaultIndexSize,
          start: last,
          end,
        };
        last = end;
        this._regions.push(gap);
      }
      const end = last + customSize.size;
      const endIndex = index + 1;
      this._regions.push({
        startIndex: customSize.index,
        endIndex,
        size: customSize.size,
        start: last,
        end,
      });
      lastIndex = endIndex;
      last = end;
    }
    if (lastIndex < this._length) {
      const end = last + (this._length - lastIndex) * this._defaultIndexSize;
      this._regions.push({
        startIndex: lastIndex,
        endIndex: this._length,
        size: this._defaultIndexSize,
        start: last,
        end,
      });
      last = end;
    }
    this._size = last;
  }

  private _findRegionIn(at: Region, position: number) {
    if (position < at.start) {
      return -1;
    } else if (position > at.end) {
      return 1;
    } else {
      return 0;
    }
  }
}
