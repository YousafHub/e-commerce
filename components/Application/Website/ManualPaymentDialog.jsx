'use client'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ButtonLoading from '@/components/Application/ButtonLoading'
import Image from 'next/image'
import { FaCamera } from 'react-icons/fa'
import jazzcashLogo from '@/public/assets/images/jazzcash.png'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Dropzone from 'react-dropzone'

const ManualPaymentDialog = ({ open, setOpen, placingOrder, onSubmit, amount }) => {
    const [transactionId, setTransactionId] = useState('')
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const handleFileSelection = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0]
        setFile(selectedFile)
        setPreview(URL.createObjectURL(selectedFile))
    }
    
    const handleSubmit = async () => {
        if (!transactionId) {
            alert('Please enter transaction ID')
            return
        }
        if (!file) {
            alert('Please upload payment proof')
            return
        }

        await onSubmit({ transactionId, file })
        setTransactionId('')
        setFile(null)
        setPreview(null)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent className='sm:max-w-[500px] w-full p-0 py-6 bg-transparent border-0 shadow-none'>
                <div className='bg-white rounded shadow-lg p-5 flex flex-col gap-5'>
                    <DialogHeader>
                        <DialogTitle className='text-lg font-semibold'>Manual Payment</DialogTitle>
                        <DialogDescription className='text-sm text-gray-500'>
                            Enter your transaction ID and upload the payment proof.
                        </DialogDescription>
                    </DialogHeader>

                    {/* JazzCash Info */}
                    <div className='flex items-center gap-3 border p-3 rounded'>
                        <Image src={jazzcashLogo.src} alt='JazzCash' width={50} height={50} />
                        <div className='flex flex-col'>
                            <span className='text-sm font-medium'>Send Money To:</span>
                            <span className='text-base font-semibold'>0300-XXXXXXX</span>
                            <span className='text-sm text-gray-500'>Amount: PKR {amount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
                        </div>
                    </div>

                    {/* Transaction ID */}
                    <div>
                        <label className='text-sm font-medium mb-1 block'>Transaction ID *</label>
                        <Input
                            placeholder='Enter transaction ID'
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className='text-sm font-medium mb-1 block'>Upload Payment Proof *</label>
                        <Dropzone onDrop={handleFileSelection} multiple={false}>
                            {({ getRootProps, getInputProps }) => (
                                <div
                                    {...getRootProps()}
                                    className='w-full h-28 border-2 border-dashed rounded flex items-center justify-center cursor-pointer relative overflow-hidden'
                                >
                                    <input {...getInputProps()} />
                                    {preview ? (
                                        <Image src={preview} alt='Preview' width={50} height={50} />
                                    ) : (
                                        <div className='text-gray-400 text-center'>
                                            Click or drag file here <br />
                                            <FaCamera className='mx-auto mt-1 text-violet-500' />
                                        </div>
                                    )}
                                </div>
                            )}
                        </Dropzone>
                    </div>

                    {/* Buttons */}
                    <div className='flex justify-end gap-3 mt-2'>
                        <Button type='button' variant='secondary' onClick={() => setOpen(false)}>
                            Close
                        </Button>
                        <ButtonLoading type='button' onClick={handleSubmit} loading={placingOrder} text='Submit Payment' />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ManualPaymentDialog