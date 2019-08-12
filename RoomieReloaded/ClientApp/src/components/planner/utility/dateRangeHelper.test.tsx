import { IHasDateRange } from "../base/plannerTypes";
import moment from 'moment';
import { isDateTimeInRange, isItemInRange, isItemTouchingRange } from './dateRangeHelper';

describe('method isDateTimeInRange', () => {
    it('considers start date to be "in range"', () => {
        const range : IHasDateRange = {
            start: moment(),
            end:moment().add(5, 'minutes')
        };

        const result = isDateTimeInRange(range.start, range);

        expect(result).toBe(true);
    }),
    it('considers end date to be "in range"', () => {
        const range : IHasDateRange = {
            start: moment(),
            end:moment().add(5, 'minutes')
        };

        const result = isDateTimeInRange(range.end, range);

        expect(result).toBe(true);
    }),
    it('considers dateTime in between start and end to be "in range"', () => {
        const range : IHasDateRange = {
            start: moment(),
            end:moment().add(5, 'minutes')
        };

        const result = isDateTimeInRange(range.start.clone().add(150, 'seconds'), range);

        expect(result).toBe(true);
    }),
    it('considers dateTime before start to be "out of range"', () => {
        const range : IHasDateRange = {
            start: moment(),
            end:moment().add(5, 'minutes')
        };

        const result = isDateTimeInRange(range.start.clone().subtract(1, 'seconds'), range);

        expect(result).toBe(false);
    }),
    it('considers dateTime after end to be "out of range"', () => {
        const range : IHasDateRange = {
            start: moment(),
            end:moment().add(5, 'minutes')
        };
        const result = isDateTimeInRange(range.end.clone().add(1, 'seconds'), range);

        expect(result).toBe(false);
    }),
    it('works with flipped ranges', () => {
        const range : IHasDateRange = {
            start: moment().add(5, 'minutes'),
            end:moment()
        };

        const result = isDateTimeInRange(range.end.clone().add(150, 'seconds'), range);

        expect(result).toBe(true);
    })
});

fdescribe('method isItemInRange', () => {
    it('considers identical item as "in range"', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        };

        const result = isItemInRange(range, range);

        expect(result).toBe(true);
    }),
    it('considers late starting item as "in range"', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        };

        const item : IHasDateRange = {
            start:range.start.clone().add(1, 'seconds'),
            end:range.end.clone()
        }

        const result = isItemInRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers early ending item as "in range"', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        };

        const item : IHasDateRange = {
            start:range.start.clone(),
            end:range.end.clone().subtract(1, 'seconds')
        }

        const result = isItemInRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers item in range as "in range"', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        };

        const item : IHasDateRange = {
            start:range.start.clone().add(1, 'seconds'),
            end:range.end.clone().subtract(1, 'seconds')
        }

        const result = isItemInRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers early starting item as "out of range"', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        };

        const item : IHasDateRange = {
            start:range.start.clone().subtract(1, 'seconds'),
            end:range.end.clone().subtract(1, 'seconds')
        }

        const result = isItemInRange(item, range);

        expect(result).toBe(false);
    }),
    it('considers late ending item as "out of range"', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        };

        const item : IHasDateRange = {
            start:range.start.clone().add(1, 'seconds'),
            end:range.end.clone().add(1, 'seconds')
        }

        const result = isItemInRange(item, range);

        expect(result).toBe(false);
    }),
    it('considers enclosing item as "out of range"', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        };

        const item : IHasDateRange = {
            start:range.start.clone().subtract(1, 'seconds'),
            end:range.end.clone().add(1, 'seconds')
        }

        const result = isItemInRange(item, range);

        expect(result).toBe(false);
    }),
    it('works with flipped range', () => {
        const range : IHasDateRange = {
            start:moment().add(5, 'minutes'),
            end:moment()
        };

        const item : IHasDateRange = {
            start:range.end.clone().add(1, 'seconds'),
            end:range.start.clone().subtract(1, 'seconds')
        }

        const result = isItemInRange(item, range);

        expect(result).toBe(true);
    }),
    it('does not work with flipped item', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        };

        const item : IHasDateRange = {
            start:range.end.clone().subtract(1, 'seconds'),
            end:range.start.clone().add(1, 'seconds')
        }

        const result = isItemInRange(item, range);

        expect(result).toBe(true);
    })
})

describe('method isItemTouchingRagen', () => {
    it('considers starting at start as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:range.start.clone(),
            end:moment().add(1, 'day')
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers starting after start as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:range.start.clone().add(1, 'second'),
            end:moment().add(1, 'day')
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers starting before end as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:range.end.clone().subtract(1, 'second'),
            end:moment().add(1, 'day')
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers starting at end as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:range.end.clone(),
            end:moment().add(1, 'day')
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    
    it('considers ending at start as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:moment().subtract(1, 'day'),
            end:range.start.clone()
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers ending after start as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:moment().subtract(1, 'day'),
            end:range.start.clone().add(1, 'second')
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers ending before end as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:moment().subtract(1, 'day'),
            end:range.end.clone().subtract(1, 'minute')
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers ending at end as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:moment().subtract(1, 'day'),
            end:range.end.clone()
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers identical item as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:range.start.clone(),
            end:range.end.clone()
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers wrapping item as touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:range.start.clone().subtract(1, 'second'),
            end:range.end.clone().add(1, "second")
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(true);
    }),
    it('considers ending before start as not touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:range.start.clone().subtract(5, 'second'),
            end:range.start.clone().subtract(1, "second")
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(false);
    }),
    it('considers starting after start as not touching', () => {
        const range : IHasDateRange = {
            start:moment(),
            end:moment().add(5, 'minutes')
        }

        const item : IHasDateRange = {
            start:range.end.clone().add(1, 'second'),
            end:range.end.clone().add(5, "second")
        }

        const result = isItemTouchingRange(item, range);

        expect(result).toBe(false);
    })
});