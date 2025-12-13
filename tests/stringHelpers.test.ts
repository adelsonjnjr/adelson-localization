import '../src/stringHelpers';

// Initialize string helpers
import { stringHelpExtensions } from '../src/stringHelpers';
stringHelpExtensions();

describe('stringHelpers', () => {
  describe('isNonEmpty', () => {
    it('should return true for non-empty strings', () => {
      expect('hello'.isNonEmpty()).toBe(true);
      expect('  test  '.isNonEmpty()).toBe(true);
    });

    it('should return false for empty or whitespace strings', () => {
      expect(''.isNonEmpty()).toBe(false);
      expect('   '.isNonEmpty()).toBe(false);
    });
  });

  describe('isNullOrWhiteSpace', () => {
    it('should return true for empty or whitespace strings', () => {
      expect(''.isNullOrWhiteSpace()).toBe(true);
      expect('   '.isNullOrWhiteSpace()).toBe(true);
      expect('\t\n'.isNullOrWhiteSpace()).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect('hello'.isNullOrWhiteSpace()).toBe(false);
      expect('  test  '.isNullOrWhiteSpace()).toBe(false);
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter', () => {
      expect('hello'.capitalizeFirstLetter()).toBe('Hello');
      expect('world'.capitalizeFirstLetter()).toBe('World');
    });

    it('should handle already capitalized strings', () => {
      expect('Hello'.capitalizeFirstLetter()).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(''.capitalizeFirstLetter()).toBe('');
    });

    it('should handle single character', () => {
      expect('a'.capitalizeFirstLetter()).toBe('A');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect('hello world'.capitalizeWords()).toBe('Hello World');
      expect('the quick brown fox'.capitalizeWords()).toBe('The Quick Brown Fox');
    });

    it('should handle already capitalized words', () => {
      expect('Hello World'.capitalizeWords()).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect('hello'.capitalizeWords()).toBe('Hello');
    });

    it('should handle multiple spaces', () => {
      expect('hello  world'.capitalizeWords()).toBe('Hello  World');
    });
  });

  describe('getInitial', () => {
    it('should return initials from single word', () => {
      expect('John'.getInitial()).toBe('J-');
    });

    it('should return initials from multiple words with comma', () => {
      expect('Doe,John'.getInitial()).toBe('DJ');
      expect('Adelson,Jean'.getInitial()).toBe('AJ');
    });

    it('should handle empty strings', () => {
      expect(''.getInitial()).toBe('--');
    });

    it('should handle whitespace', () => {
      expect('   '.getInitial()).toBe('--');
    });
  });

  describe('removeUnnecessarySpaces', () => {
    it('should remove multiple spaces', () => {
      expect('hello  world'.removeUnnecessarySpaces()).toBe('hello world');
      expect('hello   world   test'.removeUnnecessarySpaces()).toBe('hello world test');
    });

    it('should trim leading and trailing spaces', () => {
      expect('  hello world  '.removeUnnecessarySpaces()).toBe('hello world');
    });

    it('should handle already clean strings', () => {
      expect('hello world'.removeUnnecessarySpaces()).toBe('hello world');
    });

    it('should handle tabs and newlines', () => {
      expect('hello\t\tworld'.removeUnnecessarySpaces()).toBe('hello world');
      expect('hello\n\nworld'.removeUnnecessarySpaces()).toBe('hello\n\nworld');
    });
  });

  describe('format', () => {
    describe('indexed placeholders', () => {
      it('should replace indexed placeholders', () => {
        const template = 'Hello {{}}!';
        expect(template.format('World')).toBe('Hello World!');
      });

      it('should replace multiple indexed placeholders', () => {
        const template = 'You answered {{}} questions over {{}}';
        expect(template.format(5, 10)).toBe('You answered 5 questions over 10');
      });

      it('should handle more placeholders than arguments', () => {
        const template = '{{}} {{}} {{}}';
        expect(template.format('a', 'b')).toBe('a b {{}}');
      });

      it('should handle more arguments than placeholders', () => {
        const template = '{{}} {{}}';
        expect(template.format('a', 'b', 'c')).toBe('a b');
      });
    });

    describe('named placeholders', () => {
      it('should replace named placeholders', () => {
        const template = 'Hello {{name}}!';
        expect(template.format({ name: 'John' })).toBe('Hello John!');
      });

      it('should replace multiple named placeholders', () => {
        const template = '{{firstName}} {{lastName}}';
        expect(template.format({ firstName: 'John', lastName: 'Doe' }))
          .toBe('John Doe');
      });

      it('should handle missing named values', () => {
        const template = 'Hello {{name}}!';
        expect(template.format({ other: 'value' })).toBe('Hello {{name}}!');
      });
    });

    describe('mixed placeholders', () => {
      it('should handle indexed and named placeholders together', () => {
        const template = 'You answered {{}} questions over {{}} and your name is {{name}}';
        expect(template.format(5, 10, { name: 'John' }))
          .toBe('You answered 5 questions over 10 and your name is John');
      });

      it('should handle complex mixed scenario', () => {
        const template = 'Order {{}} for {{customerName}} - Total: ${{total}}';
        expect(template.format('#12345', { customerName: 'Alice', total: 99.99 }))
          .toBe('Order #12345 for Alice - Total: $99.99');
      });
    });

    describe('edge cases', () => {
      it('should handle empty template', () => {
        expect(''.format('test')).toBe('');
      });

      it('should handle no placeholders', () => {
        expect('Hello World'.format('test')).toBe('Hello World');
      });

      it('should handle no arguments', () => {
        expect('Hello {{}}!'.format()).toBe('Hello {{}}!');
      });

      it('should handle number arguments', () => {
        const template = 'Count: {{}}';
        expect(template.format(42)).toBe('Count: 42');
      });

      it('should handle boolean arguments', () => {
        const template = 'Active: {{}}';
        expect(template.format(true)).toBe('Active: true');
      });

      it('should handle null and undefined', () => {
        const template = 'Value: {{}}';
        expect(template.format(null)).toBe('Value: null');
        expect(template.format()).toBe('Value: {{}}');
      });

      it('should handle special characters in values', () => {
        const template = 'Message: {{}}';
        expect(template.format('Hello ${{}} World')).toBe('Message: Hello ${{}} World');
      });

      it('should handle object as indexed placeholder', () => {
        const template = '{{}}';
        const obj = { name: 'test' };
        expect(template.format(obj)).toBe('[object Object]');
      });
    });

    describe('real-world translation examples', () => {
      it('should format notification message', () => {
        const template = 'You have {{}} new message';
        expect(template.format(1)).toBe('You have 1 new message');
      });

      it('should format user profile', () => {
        const template = '{{firstName}} {{lastName}}, {{age}} years old';
        expect(template.format({ firstName: 'John', lastName: 'Doe', age: 30 }))
          .toBe('John Doe, 30 years old');
      });

      it('should format welcome message', () => {
        const template = 'Welcome {{name}}! You have {{}} unread notifications.';
        expect(template.format(5, { name: 'Alice' }))
          .toBe('Welcome Alice! You have 5 unread notifications.');
      });
    });
  });
});
