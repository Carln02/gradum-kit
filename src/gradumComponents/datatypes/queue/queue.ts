/**
 * @class GradumQueue
 * @group Components
 * @category Data Structures
 *
 * @template Type - The type of the queued values.
 * @description A first-in, first-out queue. {@link push} adds to the back, {@link pop} takes from the
 * front, and {@link addOnTop} jumps the line. Popping does not shift the backing array, so draining a
 * long queue stays cheap.
 */
class GradumQueue<Type = any> {
    private items: Type[] = [];
    private head = 0;

    /**
     * @description Add one or more values to the back of the queue.
     * @param {...Type[]} values - The values to enqueue, in order.
     * @returns {this} Itself, allowing for method chaining.
     */
    public push(...values: Type[]): this {
        values.forEach(value => this.items.push(value));
        return this;
    }

    /**
     * @description Add one or more values to the front of the queue, so they are popped before
     * everything already queued.
     * @param {...Type[]} values - The values to enqueue, in order.
     * @returns {this} Itself, allowing for method chaining.
     */
    public addOnTop(...values: Type[]): this {
        this.items = [...values, ...this.items];
        return this;
    }

    /**
     * @description Take the value at the front of the queue and remove it.
     * @returns {Type | undefined} The removed value, or `undefined` if the queue is empty.
     */
    public pop(): Type | undefined {
        if (this.head >= this.items.length) return undefined;

        const value = this.items[this.head];
        this.items[this.head] = undefined;
        this.head++;

        if (this.head > 1024 && this.head * 2 > this.items.length) {
            this.items = this.items.slice(this.head);
            this.head = 0;
        }

        return value;
    }

    /**
     * @description Read the value at the front of the queue without removing it.
     * @returns {Type} The next value to be popped, or `undefined` if the queue is empty.
     */
    public peek(): Type {
        return this.head < this.items.length ? this.items[this.head] : undefined;
    }

    /**
     * @description Check whether a value is queued.
     * @param {Type} value - The value to look for, compared by identity.
     * @returns {boolean} Whether the value is present.
     */
    public has(value: Type): boolean {
        return this.items.includes(value);
    }

    /**
     * @description The number of values still waiting to be popped.
     * @readonly
     */
    public get size(): number {
        return this.items.length - this.head;
    }

    /**
     * @description Whether the queue has nothing left to pop.
     * @readonly
     */
    public get isEmpty(): boolean {
        return this.size === 0;
    }

    /**
     * @description Drop repeated values, keeping the earliest occurrence of each so queue order is
     * preserved. Mutates the queue.
     * @param {Type} [entry] - Restrict deduplication to this value, leaving every other duplicate in
     * place. Omit it to deduplicate the whole queue.
     * @returns {this} Itself, allowing for method chaining.
     */
    public removeDuplicates(entry?: Type): this {
        const uniques = new Set();
        const toDelete = [];
        for (let i = 0; i < this.items.length; i++) {
            if (entry && this.items[i] !== entry) continue;
            if (!uniques.has(this.items[i])) uniques.add(this.items[i]);
            else toDelete.push(i);
        }

        for (let i = toDelete.length - 1; i >= 0; i--) this.items.splice(i, 1);
        return this;
    }

    /**
     * @description Discard every queued value.
     * @returns {this} Itself, allowing for method chaining.
     */
    public clear(): this {
        this.items = [];
        this.head = 0;
        return this;
    }

    /**
     * @description Snapshot the pending values.
     * @returns {Type[]} A new array of the values still waiting to be popped, front first. Already
     * popped values are excluded.
     */
    public toArray(): Type[] {
        const arr = [];
        for (let i = this.head; i < this.items.length; i += 1) arr.push(this.items[i]);
        return arr;
    }

    /**
     * @description Copy the queue.
     * @returns {GradumQueue<Type>} A new queue holding the same pending values in the same order. The
     * values themselves are shared, not copied.
     */
    public clone(): GradumQueue<Type> {
        const queue = new GradumQueue();
        for (let i = this.head; i < this.items.length; i += 1) queue.push(this.items[i]);
        return queue;
    }

    /**
     * @description Remove the first pending occurrence of a value, wherever it sits in the queue.
     * @param {Type} value - The value to remove, compared by identity.
     * @returns {boolean} Whether a matching value was found and removed.
     */
    public remove(value: Type): boolean {
        for (let i = this.head; i < this.items.length; i += 1) {
            if (this.items[i] !== value) continue;
            this.items.splice(i, 1);
            return true;
        }
        return false;
    }
}

export {GradumQueue};