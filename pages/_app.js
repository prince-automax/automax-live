import '../globals.css'
import Layout from '../components/layouts/layout'
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
    defaultOptions:{
        mutations:{
            onError:(e)=>{          
                alert( e?.response?.errors[0]?.message?.substring(e.response.errors[0].message.indexOf(":")+1) ?? 'Something went wrong !');    
            },
        }
    }
})

export default function MyApp({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
                <Toaster />
            </Layout>
        </QueryClientProvider>
    )
}