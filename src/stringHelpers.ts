declare global {
   interface String{
    /**
     * Checks if the string is non-empty after trimming whitespace.
     * @returns {boolean}
     * Returns true if the string is non-empty, false otherwise.
     */
    isNonEmpty(): boolean;
    /**
     * Checks if the string is null or consists only of whitespace.
     * @returns {boolean}
     * Returns true if the string is null, empty, or contains only whitespace, false otherwise.
     */
    isNullOrWhiteSpace(): boolean;
    /**
     * Capitalizes the first letter of the string.
     * @returns The string with the first letter capitalized.
     */
    capitalizeFirstLetter(): string;
    /**
     * Capitalizes the first letter of each word in the string.
     * @returns The string with the first letter of each word capitalized.
     */
    capitalizeWords(): string;
    /**
     * Gets the initial(s) of the string, typically used for names.
     * If the string is empty or undefined, returns '--'.
     * @returns The initial(s) of the string.
     */
    getInitial(): string;
    /**
     * Removes unnecessary spaces from the string, replacing multiple spaces with a 
     * single space and trimming leading/trailing spaces.
     * @returns The string with unnecessary spaces removed.
     */
    removeUnnecessarySpaces(): string;
    /**
     * @description Replaces the format items in a specified string with the string representation of the provided arguments.
     * Supports both indexed placeholders {{}} and named placeholders {{name}}.
     * @param args The objects to format. The last argument can be an object for named placeholders.
     * @returns A copy of this string with the format items replaced by the string representations of the arguments.
     * @example
     * const template = "You answered {{}} questions over {{}} and your name is {{name}}";
     * const formattedText = template.format(5, 10, { name: 'John' });
     * console.log(formattedText); // Output: "You answered 5 questions over 10 and your name is John"
     */
    format(...args: any[]): string;
   } 
}

export const stringHelpExtensions = () => {
    String.prototype.isNonEmpty = function (): boolean {
        return String(this).trim().length > 0;
    };
    String.prototype.isNullOrWhiteSpace = function (): boolean {
        return String(this).trim().length === 0;
    };
    String.prototype.capitalizeFirstLetter = function (): string {
        return String(this).charAt(0).toUpperCase() + String(this).slice(1);
    };
    String.prototype.capitalizeWords = function () {
        return String(this).replace(/(?:^|\s)\S/g, (a: string) => a.toUpperCase());
    };
    String.prototype.getInitial = function (): string {
        if (String(this).isNullOrWhiteSpace()) {
            return '--';
        }
        let splitName = String(this).split(',');
        if (splitName.length === 1) {
            return splitName[0].trim()[0].toUpperCase() + '-';
        } else if (splitName.length > 1) {
            return (splitName[0].trim()[0] + splitName[1].trim()[0]).toUpperCase();
        }
        return '';
    }
    String.prototype.removeUnnecessarySpaces = function (): string {
        // Do not remove carriage returns, as they are often used in text formatting.
        // Replace all carriage returns and line feeds with a placeholder to preserve them.
       const preservedCarriageReturnAndLineFeeds = String(this).replace(/[\r\n]/g, '␍')
       // Replace space plus ␍ at end of the string with just ␍.
        .replace(/\s+␍$/, '␍')
        // Replace multiple spaces with a single space and trim the string.
        const cleanedString = preservedCarriageReturnAndLineFeeds.replace(/\s+/g, ' ').trim();
        // Restore carriage returns to their original form.
        return cleanedString.replace(/␍/g, '\n');
    };
    String.prototype.format = function (...args: any[]) {
        const namedArgs = args[args.length - 1] || {};
        return String(this).replace(/{{([a-zA-Z0-9]*)}}/g, (match, key) => {
        if (key === '') {
            return typeof args[0] !== 'undefined' ? args.shift() : match;
        }
        return typeof namedArgs[key] !== 'undefined' ? namedArgs[key] : match;
        });
    };
};
