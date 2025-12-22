import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { IoLogoLinkedin, IoMdContact } from 'react-icons/io';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useEffect, useRef, useState } from 'react';

export interface ContactDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContactDialog: React.FC<ContactDialogProps> = ({ open, setOpen }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!formRef.current) return;

    e.preventDefault();

    if (submitted || !formRef.current.checkValidity()) return;

    const formData = new FormData(formRef.current);
    const params = new URLSearchParams(
      Object.fromEntries(formData) as Record<string, string>
    ).toString();

    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      if (!r.ok) throw new Error(`Not submitted, ${r.status}, ${r.statusText}`);

      setSubmitted(true);
    } catch (err) {
      console.error(err);

      window.alert('Form failed to submit. Please contact me via LinkedIn instead.');
    }
  };

  useEffect(() => {
    if (!open && submitted) setSubmitted(false);
  }, [open, submitted]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={isMobile ? 'icon-lg' : 'lg'}
          variant='outline'
          className='glass fixed bottom-4 right-4 items-center z-10 animate-sweep'
        >
          <IoMdContact />
          {!isMobile && 'Contact'}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Me</DialogTitle>
          <DialogDescription>
            I’m always open to discussing new projects, creative ideas, or opportunities to be part
            of your visions. Drop me a message and let’s connect!
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          className='flex flex-col gap-6 pt-4'
          onSubmit={onSubmit}
          aria-disabled={submitted}
        >
          <input type='hidden' name='form-name' value='contact' disabled={submitted} />

          <div className='flex flex-col gap-2'>
            <Label htmlFor='contact-name'>Your name</Label>
            <Input
              type='text'
              name='name'
              id='contact-name'
              required
              minLength={3}
              placeholder='John Doe'
              disabled={submitted}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='contact-email'>Your Email</Label>
            <Input
              type='email'
              name='email'
              id='contact-email'
              required
              minLength={3}
              placeholder='example@email.com'
              disabled={submitted}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='contact-description'>Inquiry Details</Label>
            <Textarea
              name='description'
              id='contact-description'
              required
              minLength={20}
              className='min-h-20 max-h-60'
              placeholder='Tell me a bit about your project or just say hello...'
              disabled={submitted}
            ></Textarea>
          </div>

          {submitted ? (
            <p>
              Thanks for reaching out. I’ve received your inquiry and will get back to you within 24
              hours. Have a great day!
            </p>
          ) : (
            <div className='flex gap-4 justify-between sm:justify-between'>
              <Button asChild variant='secondary' size='icon-lg'>
                <a href='https://www.linkedin.com/in/xristos-niaskos' target='_blank'>
                  <IoLogoLinkedin />
                </a>
              </Button>

              <Button type='submit' variant='secondary' size='lg'>
                Send
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
