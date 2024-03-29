import { URLPattern } from "urlpattern-polyfill";
import { NextResponse } from "next/server";

// Gets the code from dynamic path
const PATTERNS = [
    [
        new URLPattern({ pathname: "/game/:code*" }),
        ({ pathname }) => pathname.groups,
    ],
];

const params = (url) => {
    const input = url.split("?")[0];
    let result = {};

    for (const [pattern, handler] of PATTERNS) {
        const patternResult = pattern.exec(input);
        if (patternResult !== null && "pathname" in patternResult) {
            result = handler(patternResult);
            break;
        }
    }

    const searchParams = new URLSearchParams(url.split("?")[1]);
    for (const [key, value] of searchParams.entries()) {
        result[key] = value;
    }

    return result;
};

export async function middleware(request) {
    // Get the id and nickname param
    const { code, nickname } = params(request.url);

    const baseURL = new URL(request.url).origin;

    const exists = await fetch(`${baseURL}/api/channels-exist`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: code,
    });

    if (exists.ok && nickname) {
        // Valid code
        return NextResponse.next();
    } else {
        // Not a valid code
        return NextResponse.redirect(new URL("/404", request.url));
    }
}

export const config = {
    matcher: ["/game/:code*"],
};
