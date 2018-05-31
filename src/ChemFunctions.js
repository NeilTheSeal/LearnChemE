export function Antoine(T, A, B, C) {
    return Math.pow(10, A - B / (T + C))
}

export function InvAntoine(P, A, B, C) {
    return B / (A - Math.log10(P)) - C;
}

export function BubblePoint(x1, Psat1, Psat2) {
    return x1 * Psat1 + (1 - x1) * Psat2;
}

export function DewPoint(x1, Psat1, Psat2) {
    return Math.pow(x1 / Psat1 + (1 - x1) / Psat2, -1);
}
