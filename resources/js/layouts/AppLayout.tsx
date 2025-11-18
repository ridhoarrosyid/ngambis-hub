import AppFooterLayout from './app/AppFooterLayout';
import { AppHeaderLayout } from './app/AppHeaderLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeaderLayout />
            <main className="min-h-screen">{children}</main>
            <AppFooterLayout />
        </>
    );
}
