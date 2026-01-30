"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="hidden md:block bg-bluealt-200 text-white pt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                <div>
                    <div className="flex items-center mb-4">
                        <Image 
                            src="/logosmkn5.png" 
                            alt="SMKN 5 Logo" 
                            width={50} 
                            height={50}
                            className="mr-3"
                        />
                        <a href="https://www.smkn5malang.sch.id" className="group" target="_blank" rel="noopener noreferrer">
                            <h3 className="text-2xl font-bold text-white group-hover:text-sky-200 transition-colors">SMKN 5 MALANG</h3>
                            <p className="text-sm text-gray-200 uppercase tracking-wide group-hover:text-sky-200 transition-colors">CERDAS - TERAMPIL - KOMPETITIF</p>
                        </a>
                    </div>
                    <div className="bg-gray-300 rounded-lg overflow-hidden mb-4">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.6710197577545!2d112.63321307533678!3d-7.929386992094398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd629f1b8a28299%3A0xa995c6171f4fe894!2sSMK%20Negeri%205%20Kota%20Malang!5e0!3m2!1sid!2sid!4v1764943995630!5m2!1sid!2sid"
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-44"
                        ></iframe>
                    </div>
                </div>

                <div>
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-2">Email</h4>
                        <a href="mailto:info@smkn5malang.sch.id" className="text-sm text-gray-200">info@smkn5malang.sch.id</a>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-2">Alamat</h4>
                        <p className="text-sm text-gray-200">
                            Jl. Ikan Piranha Atas, Tunjungsekar, Kec. Lowokwaru,<br />
                            Kota Malang, Jawa Timur 65142
                        </p>
                    </div>

                    <div>
                        <h4 className="text-md font-semibold mb-2">Telepon</h4>
                        <p className="text-sm text-gray-200">0341-478195</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-md font-semibold mb-4">Program Keahlian</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <Link href="https://www.smkn5malang.sch.id/page/jurusan/kriya-kayu" target="_blank" className="block text-gray-200 hover:text-white transition-colors">
                                <span className="mr-2">›</span>Kriya Kreatif Kayu & Rotan
                            </Link>
                            <Link href="https://www.smkn5malang.sch.id/page/jurusan/kriya-tekstil" target="_blank" className="block text-gray-200 hover:text-white transition-colors">
                                <span className="mr-2">›</span>Kriya Kreatif Batik & Tekstil
                            </Link>
                            <Link href="https://www.smkn5malang.sch.id/page/jurusan/animasi" target="_blank" className="block text-gray-200 hover:text-white transition-colors">
                                <span className="mr-2">›</span>Animasi
                            </Link>
                            <Link href="https://www.smkn5malang.sch.id/page/jurusan/tkj-teknik-komputer-dan-jaringan" target="_blank" className="block text-gray-200 hover:text-white transition-colors">
                                <span className="mr-2">›</span>TKJT
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <Link href="https://www.smkn5malang.sch.id/page/jurusan/kriya-keramik" target="_blank" className="block text-gray-200 hover:text-white transition-colors">
                                <span className="mr-2">›</span>Kriya Kreatif Keramik
                            </Link>
                            <Link href="https://www.smkn5malang.sch.id/page/jurusan/tata-busana" target="_blank" className="block text-gray-200 hover:text-white transition-colors">
                                <span className="mr-2">›</span>Desain dan Produksi Busana
                            </Link>
                            <Link href="https://www.smkn5malang.sch.id/page/jurusan/rpl-rekayasa-perangkat-lunak" target="_blank" className="block text-gray-200 hover:text-white transition-colors">
                                <span className="mr-2">›</span>RPL
                            </Link>
                            <Link href="https://www.smkn5malang.sch.id/page/jurusan/multimedia" target="_blank" className="block text-gray-200 hover:text-white transition-colors">
                                <span className="mr-2">›</span>DKV
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-sm border-t bg-sky-900 border-gray-700 mt-8 py-3 text-center">
                <p className="text-gray-300">
                    Made with 🤍 by <Link href="/credits" className="text-white underline hover:text-blue-200">AYIDA Team</Link> 2025
                </p>
            </div>
        </footer>
    );
}
