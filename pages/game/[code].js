import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter();
    const code = router.query.code;

    return (
        <>
            <h1>Regular</h1>
            <p>Game: {code}</p>
        </>
    );
}