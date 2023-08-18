import Link from 'next/link'
import Image from 'next/image'
import LogoImage from '@assets/logo.png'

export default function Logo() {

    return (
        <Link href="/">
            <a className="mt-1 w-36">
                <Image
                    src={LogoImage}
                    alt="auto bse"
                    width={180}
                    height={60}
                />
            </a>
        </Link >
    );
}

