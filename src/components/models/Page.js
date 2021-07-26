export class Page {
	constructor({results, index, setIndex, hasNext, next, accumulateNext, hasPrevious, previous, accumulatePrevious, pageCount}) {
		this.results = results;
		this.index = index;
		this.setIndex = setIndex;
		this.hasNext = hasNext;
		this.next = next;
		this.accumulateNext = accumulateNext;
		this.hasPrevious = hasPrevious;
		this.previous = previous;
		this.accumulatePrevious = accumulatePrevious;
		this.pageCount = pageCount;
	}

	map(cb) {
		let results = this.results.map(cb);
		return new Page({...this, results});
	}

	get length () {
		return this.results.length;
	}
}
