import {gradum} from "../gradumFunctions/gradumFunctions";
import {GradumEventManager} from "../eventHandling/gradumEventManager/gradumEventManager";

/**
 * @internal
 * @type {FieldType}
 * @description The MVC roles the field decorators in this file can fetch. Doubles as the suffix stripped
 * from a field name when inferring its key — a field named `textHandler` resolves the key `"text"`.
 */
type FieldType = "Operator" | "Handler" | "Interactor" | "Tool" | "Constrainer";

/**
 * @internal
 */
function inferKey(name: string, type: FieldType, context: ClassFieldDecoratorContext) {
    return name ?? (String(context.name).endsWith(type)
        ? String(context.name).slice(0, -type.length)
        : String(context.name));
}

/**
 * @internal
 */
function generateField(context: ClassFieldDecoratorContext, type: FieldType, name?: string) {
    const cacheKey = Symbol(`__${type.toLowerCase()}_${String(context.name)}`);
    const keyName = inferKey(name, type, context);

    context.addInitializer(function () {
        Object.defineProperty(this, context.name, {
            configurable: true,
            enumerable: false,
            get: function () {
                if (this[cacheKey]) return this[cacheKey];

                let value: unknown;
                let functionName: string;

                switch (type) {
                    case "Operator":
                        functionName = "getOperator";
                        break;
                    case "Handler":
                        functionName = "getHandler";
                        break;
                    case "Interactor":
                        functionName = "getInteractor";
                        break;
                    case "Tool":
                        functionName = "getTool";
                        break;
                    case "Constrainer":
                        functionName = "getConstrainer";
                        break;
                }

                if (!functionName) return;
                value = gradum(this)[functionName]?.(keyName);
                if (!value) throw new Error(`${type} "${keyName}" not found on ${this?.constructor?.name}.`);
                this[cacheKey] = value;
                return value;
            },
            set: function (value: unknown) { this[cacheKey] = value; }
        });
    });
}

/**
 * @decorator
 * @function operator
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched operator.
 * @param {string} [name] - The key name of the operator in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingOperator`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @operator() protected textOperator: GradumOperator;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textOperator(): GradumOperator {
 *    if (this.mvc instanceof Mvc) return this.mvc.getOperator("text");
 *    if (typeof this.getOperator === "function") return this.getOperator("text");
 * }
 * ```
 */
function operator(name?: string) {
    return function (_unused: unknown, context: ClassFieldDecoratorContext) {
        generateField(context, "Operator", name);
    };
}

/**
 * @decorator
 * @function handler
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched handler.
 * @param {string} [name] - The key name of the handler in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingHandler`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @handler() protected textHandler: GradumHandler;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textHandler(): GradumHandler {
 *    if (this.mvc instanceof Mvc) return this.mvc.getHandler("text");
 *    if (typeof this.getHandler === "function") return this.getHandler("text");
 * }
 * ```
 */
function handler(name?: string) {
    return function (_unused: unknown, context: ClassFieldDecoratorContext) {
        generateField(context, "Handler", name);
    };
}

/**
 * @decorator
 * @function interactor
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched interactor.
 * @param {string} [name] - The key name of the interactor in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingInteractor`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @interactor() protected textInteractor: GradumInteractor;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textInteractor(): GradumInteractor {
 *    if (this.mvc instanceof Mvc) return this.mvc.getInteractor("text");
 *    if (typeof this.getInteractor === "function") return this.getInteractor("text");
 * }
 * ```
 */
function interactor(name?: string) {
    return function (_unused: unknown, context: ClassFieldDecoratorContext) {
        generateField(context, "Interactor", name);
    };
}

/**
 * @decorator
 * @function tool
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched tool.
 * @param {string} [name] - The key name of the tool in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingTool`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @tool() protected textTool: GradumTool;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textTool(): GradumTool {
 *    if (this.mvc instanceof Mvc) return this.mvc.getTool("text");
 *    if (typeof this.getTool === "function") return this.getTool("text");
 * }
 * ```
 */
function tool(name?: string) {
    return function (_unused: unknown, context: ClassFieldDecoratorContext) {
        generateField(context, "Tool", name);
    };
}

/**
 * @decorator
 * @function constrainer
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched constrainer.
 * @param {string} [name] - The key name of the constrainer in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingConstrainer`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @tool() protected textConstrainer: GradumConstrainer;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textConstrainer(): GradumConstrainer {
 *    if (this.mvc instanceof Mvc) return this.mvc.getConstrainer("text");
 *    if (typeof this.getConstrainer === "function") return this.getConstrainer("text");
 * }
 * ```
 */
function constrainer(name?: string) {
    return function (_unused: unknown, context: ClassFieldDecoratorContext) {
        generateField(context, "Constrainer", name);
    };
}

export {operator, handler, interactor, tool, constrainer};
