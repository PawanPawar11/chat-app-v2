import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
    const { authUser } = useAuthStore();

    return (
        <div className="flex items-center justify-center pt-20 px-4">
            <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                <div className="flex h-full rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center w-full h-full bg-background/50 backdrop-blur-lg border border-border rounded-xl">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-primary mb-4">Welcome, {authUser?.fullName}!</h1>
                            <p className="text-muted-foreground text-lg">You are now logged in.</p>
                            <p className="text-sm text-muted-foreground mt-2">Select a user to start chatting (Implementation Pending)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
